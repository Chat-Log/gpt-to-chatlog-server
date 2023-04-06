import { Injectable } from '@nestjs/common';
import { ChatGPTModel } from 'src/ai-models/chat-gpt-model';
import { TopicImpl } from './topic';
import { Readable } from 'stream';
import { Model } from '../../common/enum/enum';
import { ModelProvider } from 'src/model-provider/model-provider';
import { AskQuestionDto } from './dto/ask-question.dto';
import { TopicOrmRepository } from './topic.orm-repository';
import { UserImpl } from '../../user/infra/user';
import { TagOrmRepository } from './completion/tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicOrmRepository,
    private readonly tagRepository: TagOrmRepository,
    private readonly completionRepository: CompletionOrmRepository,
  ) {}
  chooseModel(model: Model): ModelProvider {
    switch (model) {
      case Model['GPT3.5_TURBO']:
        return new ChatGPTModel();
      default:
        return new ChatGPTModel();
    }
  }

  async makeCompletion(dto: AskQuestionDto): Promise<Readable> {
    const { model, question, tags, topicId, prevCompletionIds } = dto;
    let topic;
    if (!topicId) {
      topic = TopicImpl.createTopic([], new UserImpl());
    } else {
      topic = await this.topicRepository.findOne({ where: { id: topicId } });
    }
    const answerStream = topic.askToModel(this.chooseModel(model), question);

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
