import { Injectable } from '@nestjs/common';
import { ChatGPTModel } from 'src/ai-models/chat-gpt-model';
import { TopicImpl } from './topic';
import { Readable } from 'stream';
import { ModelName } from '../../common/enum/enum';
import { ModelProvider } from 'src/model-provider/model-provider';
import { AskQuestionDto } from './dto/ask-question.dto';
import { TopicOrmRepository } from './topic.orm-repository';
import { TagOrmRepository } from './completion/tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';
import { UserService } from '../../user/infra/user.service';
import { TagImpl } from './completion/tag/tag';
import { Tag } from '../domain/completion/tag/tag';
import { Topic } from '../domain/topic';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicOrmRepository,
    private readonly tagRepository: TagOrmRepository,
    private readonly completionRepository: CompletionOrmRepository,
    private readonly userService: UserService,
  ) {}

  chooseModel(model: ModelName): ModelProvider {
    switch (model) {
      case ModelName['GPT3.5_TURBO']:
        return new ChatGPTModel();
      default:
        return new ChatGPTModel();
    }
  }

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
    }
    console.log(topic);
    // const answerStream = topic.askToModel(this.chooseModel(model), question);
    //
    // answerStream.on('data', (data) => {});
    // answerStream.on('end', async () => {
    //   await this.topicRepository.save(topic);
    // });
    //
    // return answerStream;
    return null;
  }

  async checkTagsOrCreate(userId: string, tagNames: string[]): Promise<Tag[]> {
    const tags = await this.tagRepository.findTagInNames(userId, tagNames);
    const newTagNames = tagNames.filter((tag) => !tagNames.includes(tag));
    let newTags: Tag[] = [];
    if (newTagNames.length > 0) {
      newTags = newTagNames.map((tagName) => {
        return new TagImpl({ name: tagName });
      });
    }
    return [...tags, ...newTags];
  }

  getHello(): string {
    return 'Hello World!';
  }
}
