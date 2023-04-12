import { Injectable } from '@nestjs/common';
import { TopicImpl } from './topic';
import { Readable } from 'stream';
import { AskQuestionDto } from './dto/ask-question.dto';
import { TopicOrmRepository } from './topic.orm-repository';
import { TagOrmRepository } from './completion/tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';
import { UserService } from '../../user/infra/user.service';
import { Tag } from '../domain/completion/tag/tag';
import { Topic } from '../domain/topic';
import { TagImpl } from './completion/tag/tag';
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

    const tags = await this.checkTagsOrCreate(userId, tagNames);

    if (!topicId) {
      topic = TopicImpl.createTopic(tags, user);
    } else {
      topic = await this.topicRepository.findOneWithCompletionsAndTags({
        completionIdsIn: prevCompletionIds,
        where: { id: topicId, user: { id: userId } },
      });
      topic.addTags(tags);
    }
    const answerStream = topic.askToModel(chooseModel(modelName), question);

    answerStream.on('data', (data) => {});
    answerStream.on('end', async () => {
      await this.topicRepository.save(topic);
    });

    return answerStream;
  }

  async checkTagsOrCreate(userId: string, tagNames: string[]): Promise<Tag[]> {
    const tags = await this.tagRepository.findTagInNames(userId, tagNames);
    const newTagNames = tagNames.filter(
      (tagName) => !tags.some((tag) => tag.getPropsCopy().name === tagName),
    );
    let newTags: Tag[] = [];
    if (newTagNames.length > 0) {
      newTags = newTagNames.map((tagName) => {
        return TagImpl.create(tagName);
      });
    }
    return [...tags, ...newTags];
  }

  getHello(): string {
    return 'Hello World!';
  }
}
