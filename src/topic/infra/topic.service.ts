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
import { SaveTopicSyncTagsTransaction } from './transaction/save-topic-sync-tags.transaction';
import { SearchCompletionsWithTopicOptions } from '../../common/interface/interface';
import { Readable } from 'stream';

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
  ): Promise<{ answerStream: Readable; topic: Topic }> {
    const {
      modelName,
      question,
      tagNames,
      topicId,
      prevCompletionIds,
      topicTitle,
    } = dto;
    const user = await this.userService.findUserByIdOrThrowError(userId);
    let topic: Topic;
    let changeTopicTitleRequired = false;
    if (!topicId) {
      topic = TopicImpl.createTopic(tagNames, user);
      if (topicTitle) {
        topic.changeTopicTitle(topicTitle);
      }
      changeTopicTitleRequired = true;
    } else {
      topic = await this.topicRepository.findOneWithCompletionInIds({
        completionIdsIn: prevCompletionIds,
        where: { id: topicId, user: { id: userId } },
      });
      if (!topic) {
        throw new DataNotFoundException('topic not found with id : ' + topicId);
      }
      topic.syncTagsWithNewTagNames(tagNames, true);
    }
    const answerStream = topic.askToModel(chooseModel(modelName), question, {
      changeTopicTitleRequired,
    });

    answerStream.on('data', (data) => {});
    answerStream.on('end', async () => {
      await new SaveTopicSyncTagsTransaction(this.dataSource).run({
        topic,
      });
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

  async searchCompletionsWithTopic(options: SearchCompletionsWithTopicOptions) {
    return await this.completionRepository.searchCompletionsWithTopic(options);
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
}
