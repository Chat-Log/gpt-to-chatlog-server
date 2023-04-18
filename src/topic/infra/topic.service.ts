import { Injectable } from '@nestjs/common';
import { TopicImpl } from './topic';
import { Readable } from 'stream';
import { AskQuestionDto } from './dto/ask-question.dto';
import { TopicOrmRepository } from './topic.orm-repository';
import { TagOrmRepository } from './completion/tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';
import { UserService } from '../../user/infra/user.service';
import { Topic } from '../domain/topic';
import { chooseModel } from '../../common/util/util';
import { DataNotFoundException } from '../../common/exception/data-access.exception';
import { DataSource } from 'typeorm';
import { SaveTopicSyncTagsTransaction } from './transaction/save-topic-sync-tags.transaction';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicOrmRepository,
    private readonly tagRepository: TagOrmRepository,
    private readonly completionRepository: CompletionOrmRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async askQuestion(dto: AskQuestionDto, userId: string): Promise<Readable> {
    const { modelName, question, tagNames, topicId, prevCompletionIds } = dto;
    const user = await this.userService.findUserByIdOrThrowError(userId);
    let topic: Topic;

    if (!topicId) {
      topic = TopicImpl.createTopic(tagNames, user);
    } else {
      topic = await this.topicRepository.findOneWithCompletionsAndTags({
        completionIdsIn: prevCompletionIds,
        where: { id: topicId, user: { id: userId } },
      });
      topic.syncTagsWithNewTagNames(tagNames, true);

      if (!topic) {
        throw new DataNotFoundException('topic not found with id : ' + topicId);
      }
    }
    const answerStream = topic.askToModel(chooseModel(modelName), question);

    answerStream.on('data', (data) => {});
    answerStream.on('end', async () => {
      await new SaveTopicSyncTagsTransaction(this.dataSource).run({
        topic,
      });
    });

    return answerStream;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
