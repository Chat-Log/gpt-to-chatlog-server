import { Readable } from 'stream';
import axios from 'axios';
import { CompleteOptions, IMessage } from '../common/interface/interface';
import { ModelName } from '../common/enum/enum';
import { ModelProvider } from '../model-provider/model-provider';
import { Completion } from '../topic/domain/completion/completion';
import { User } from '../user/domain/user';
import { InvalidGptKeyException } from '../common/exception/bad-request.exception';
import { InternalServerErrorCustomException } from '../common/exception/internal.exception';

const data = {
  model: 'gpt-3.5-turbo',
  stream: true,
  max_tokens: 1048,
};

const createHeaders = (apiKey: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
};

export class ChatGPTModel extends ModelProvider {
  protected name = ModelName['GPT3.5_TURBO'];
  async askQuestion(
    user: User,
    completion: Completion,
    options?: CompleteOptions,
  ): Promise<Readable> {
    const messages = this.mapToMessages([
      ...options?.previousCompletions,
      completion,
    ]);

    let result;
    try {
      result = await ChatGPTModel.sendQuestionToModel(user, messages);
    } catch (err) {
      if (err?.response?.status == 401) {
        throw new InvalidGptKeyException();
      } else {
        throw new InternalServerErrorCustomException();
      }
    }

    const readable = new Readable({
      read() {},
    });
    const stream = result.data;
    stream.on('data', (chunk) => {
      const parsedString = ChatGPTModel.parseData(chunk.toString());
      readable.push(parsedString);
    });
    stream.on('end', () => {
      readable.push(null);
    });

    return new Promise((resolve) => resolve(readable));
  }

  countToken(completions: Completion[]): number {
    const messages = this.mapToMessages(completions);
    return this.tokenManager.getTokenCountForMessages(messages);
  }
  static async sendQuestionToModel(
    user: User,
    messages: IMessage[],
  ): Promise<any> {
    if (!user.getPropsCopy().gptKey) {
      throw new InvalidGptKeyException('no have key');
    }
    return await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        ...data,
        messages,
      },
      {
        headers: createHeaders(user.getPropsCopy().gptKey),
        responseType: 'stream',
      },
    );
  }
  mapToMessages(completions: Completion[]): IMessage[] {
    const len = completions.length;
    const messages = completions.map((completion, idx) => {
      // console.log(completion);
      if (idx == len - 1) {
        return [
          {
            role: 'user',
            content: completion.getPropsCopy().question,
          },
        ];
      } else
        return [
          {
            role: 'system',
            content: completion.getPropsCopy().question,
          },
          {
            role: 'system',
            content: completion.getPropsCopy().answer,
          },
        ];
    });
    // console.log(messages);
    return messages.flat();
  }

  static parseData(inputData: string): string {
    // console.log(inputData);
    const data = inputData.split('data: ');
    const target = data[data.length - 1];

    // console.log(inputData.split('data: ').length);
    if (target && target.startsWith('{')) {
      const obj = JSON.parse(target);
      // console.log(obj.choices);
      const writeData = obj.choices && obj.choices[0].delta.content;
      if (writeData) {
        return writeData;
      }
    }
  }
}
