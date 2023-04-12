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

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicOrmRepository,
    private readonly tagRepository: TagOrmRepository,
    private readonly completionRepository: CompletionOrmRepository,
    private readonly userService: UserService,
  ) {}

  async makeCompletion(dto: AskQuestionDto, userId: string): Promise<Readable> {
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
    }
    const answerStream = topic.askToModel(chooseModel(modelName), question);

    answerStream.on('data', (data) => {});
    answerStream.on('end', async () => {
      await this.topicRepository.save(topic);
    });

    return answerStream;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
