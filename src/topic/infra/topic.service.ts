import { Injectable } from '@nestjs/common';
import { TopicImpl } from './topic';
import { AskQuestionDto } from './dto/ask-question.dto';
import { TopicOrmRepository } from './topic.orm-repository';
import { TagOrmRepository } from './tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';
import { UserService } from '../../user/infra/user.service';
import { Topic } from '../domain/topic';
import { chooseModel } from '../../common/util/util';
import { DataNotFoundException } from '../../common/exception/data-access.exception';
import { DataSource } from 'typeorm';
import {
  AbortSignal,
  SearchCompletionsWithTopicOptions,
} from '../../common/interface/interface';
import { Readable } from 'stream';
import { RetrieveRecentTopicsTitleDto } from './dto/retrieve-recent-topics-title.dto';
import { ModelName } from '../../common/enum/enum';
import { ChatGptPricePerToken } from '../../common/constant/chatgpt-price-per-token';
import { SaveTopicSyncTagsTransaction } from './transaction/save-topic-sync-tags.transaction';
import { TagImpl } from './tag/tag';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicOrmRepository,
    private readonly tagRepository: TagOrmRepository,
    private readonly completionRepository: CompletionOrmRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async askQuestion(
    dto: AskQuestionDto,
    userId: string,
    abortManager: AbortSignal,
  ): Promise<{ answerStream: Readable; topic: Topic }> {
    const {
      modelName,
      question,
      tagNames,
      topicId,
      topicTitle,
      completionReferCount = 5,
    } = dto;
    const user = await this.userService.findUserByIdOrThrowError(userId);
    let topic: Topic;
    let changeTopicTitleRequired = false;

    if (!topicId) {
      topic = TopicImpl.createTopic(tagNames || [], user);
      if (topicTitle) {
        topic.changeTopicTitle(topicTitle);
      }
      changeTopicTitleRequired = true;
    } else {
      topic = await this.topicRepository.findOneWithPreviousCompletions({
        completionReferCount,
        where: { id: topicId, user: { id: userId } },
      });
      if (!topic) {
        throw new DataNotFoundException('topic not found with id : ' + topicId);
      }
      topic.syncTagsWithNewTagNames(tagNames || [], true);
    }
    const answerStream = await topic.askToModel(
      chooseModel(modelName),
      abortManager,
      question,
      {
        changeTopicTitleRequired,
      },
    );
    answerStream.on('data', (data) => {
      if (abortManager.isAborted) {
        answerStream.emit('end');
      }
    });
    answerStream.on('end', async () => {
      await new SaveTopicSyncTagsTransaction(this.dataSource).run({
        topic,
      });
      answerStream.destroy();
    });
    return { answerStream, topic };
  }
  async changeTopicTitle(topicId: string, topicName: string): Promise<Topic> {
    const topic = await this.topicRepository.findOneWithCompletionsAndTags({
      where: { id: topicId },
    });
    if (!topic)
      throw new DataNotFoundException('topic not found with id : ' + topicId);
    topic.changeTopicTitle(topicName);
    await this.topicRepository.save(topic);
    return topic;
  }
  async retrieveTopic(topicId, userId) {
    const topic = await this.topicRepository.findOneWithCompletionsAndTags({
      where: { id: topicId, user: { id: userId } },
    });

    if (!topic)
      throw new DataNotFoundException('topic not found with id : ' + topicId);
    return topic;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async searchCompletionsWithTopic(
    userId: string,
    options: SearchCompletionsWithTopicOptions,
  ) {
    return await this.completionRepository.searchCompletionsWithTopic(
      userId,
      options,
    );
  }

  async retrieveAllTags(userId: string) {
    return await this.tagRepository.findAllTagsByUserId(userId);
  }

  async retrieveDailyCompletionCounts(userId: string, year: string) {
    return await this.completionRepository.retrieveDailyCompletionCounts(
      userId,
      year,
    );
  }

  async retrieveRecentTopicsTitle(
    dto: RetrieveRecentTopicsTitleDto,
    userId: string,
  ) {
    const { pageSize = 10, pageIndex = 1 } = dto;
    return await this.topicRepository.retrieveRecentTopicsTitle(
      userId,
      pageIndex,
      pageSize,
    );
  }
  private getModelNameValues = () => {
    return Object.values(ModelName);
  };
  async retrieveModels() {
    return this.getModelNameValues();
  }

  async retrieveUsedTokenCount(
    userId: string,
    modelNames: ModelName[],
    year: string,
    month?: string,
    groupByEachModel?: boolean,
  ) {
    const result = await this.completionRepository.retrieveUsedTokenCount(
      userId,
      modelNames,
      year,
      { groupByEachModel, month },
    );
    let monthlyCounts = { count: 0 };

    if (groupByEachModel) {
      const dailyCounts: { [date: string]: { [modelName: string]: number } } =
        {};
      result.forEach((row: any) => {
        const date = row.date;
        const modelName = row.modelName;
        const count = row.count;
        if (!dailyCounts[date]) {
          dailyCounts[date] = {};
        }
        if (!monthlyCounts[modelName]) {
          monthlyCounts[modelName] = 0;
        }

        dailyCounts[date][modelName] = count;
        monthlyCounts[modelName] += count;
      });

      const output = [];
      Object.keys(dailyCounts).forEach((date) => {
        const countsByModel = dailyCounts[date];
        let count = 0;
        Object.keys(countsByModel).forEach((modelName) => {
          count += countsByModel[modelName];
        });
        const entry = { date, ...countsByModel, count };

        output.push(entry);
      });
      Object.keys(monthlyCounts).forEach((modelName) => {
        monthlyCounts['count'] += monthlyCounts[modelName];
      });

      return { monthlyCounts, dailyCounts: output };
    } else {
      const dailyCounts: { date: string; count: number }[] = [];
      result.forEach((row: any) => {
        const date = row.date;
        const count = row.count;

        monthlyCounts['count'] += count;

        const entry = { date, count };
        dailyCounts.push(entry);
      });
      return {
        dailyCounts,
        monthlyCounts,
      };
    }
  }

  async retrieveExpectedFee(
    userId: string,
    modelNames: ModelName[],
    year: string,
    month: string,
  ) {
    const { monthlyCounts, dailyCounts } = await this.retrieveUsedTokenCount(
      userId,
      modelNames,
      year,
      month,
      true,
    );
    delete monthlyCounts['count'];
    let totalFee = 0;

    for (const modelName of Object.keys(monthlyCounts)) {
      const count = monthlyCounts[modelName];
      if (ChatGptPricePerToken[modelName]) {
        monthlyCounts[modelName] = count * ChatGptPricePerToken[modelName];
        totalFee += monthlyCounts[modelName];
      } else {
        monthlyCounts[modelName] = 0;
      }
      monthlyCounts['totalFee'] = totalFee;
    }
    for (const count of dailyCounts) {
      delete count['count'];
      let totalFee = 0;

      Object.keys(count).forEach((key) => {
        if (key !== 'date' && key !== 'count') {
          if (ChatGptPricePerToken[key]) {
            count[key] = count[key] * ChatGptPricePerToken[key];
            totalFee += count[key];
          } else {
            count[key] = 0;
          }
        }
      });
      count['totalFee'] = totalFee;
    }

    return { monthlyCounts, dailyCounts };
  }
  async addTopicTag(userId: string, topicId: string, tagName: string) {
    await this.tagRepository.addTagToTopic(topicId, TagImpl.create(tagName));
  }

  async deleteTopicTag(userId: string, topicId: string, tagName: string) {
    const tag = await this.tagRepository.findOne({
      where: { name: tagName, topic: { id: topicId } },
    });

    await this.tagRepository.deleteTagToTopic(topicId, tag);
  }
}
