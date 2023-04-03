import { Injectable } from '@nestjs/common';
import { CompletionImpl } from './completion/completion';
import { ChatGPTModel } from 'src/ai-models/chat-gpt-model';
import { TopicImpl } from './topic';
import { Readable } from 'stream';
import { Model } from '../../common/enum/enum';
import { ModelProvider } from 'src/model-provider/model-provider';
import { AskQuestionDto } from './dto/ask-question.dto';
import { Topic } from '../domain/topic';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepository: TopicRepository) {}
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
    const apiModel = this.chooseModel(model);
    const newCompletion = new CompletionImpl(apiModel, question);
    const answerStream = CompletionImpl.askQuestion(
      new ChatGPTModel(),
      question,
    );
    answerStream.on('data', (data) => {
      console.log(data);
      // console.log(data.toString());
    });
    // console.log(answerStream.o);
    // answerStream.on('data', (data) => {
    //   console.log(data);
    // });
    answerStream.on('end', async () => {
      newCompletion.writeAnswer('answer');
      const topic = TopicImpl.createTopicForFirstCompletion(
        question.slice(0, 10),
        newCompletion,
      );
      // if (!topicId) {
      //   const topic = TopicImpl.createTopicForFirstCompletion(
      //     question.slice(0, 10),
      //     newCompletion,
      //   );
      //
      //   return answerStream;
      // }
      await this.topicRepository.save(topic);
      console.log(await this.topicRepository.find());
    });
    return answerStream;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
