import { Readable } from 'stream';
import axios from 'axios';
import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import Config from '../config/config';
import { CompleteOptions, IMessage } from '../common/interface/interface';
import { ModelName } from '../common/enum/enum';

const data = {
  model: 'gpt-3.5-turbo',
  stream: true,
  max_tokens: 1048,
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Config.chatGptApiKey}`,
};

export class ChatGPTModel extends ModelProvider {
  protected name = ModelName['GPT3.5_TURBO'];
  askQuestion(completion: Completion, options?: CompleteOptions): any {
    const messages = this.mapToMessages([
      ...options?.previousCompletions,
      completion,
    ]);

    const result = ChatGPTModel.sendQuestionToModel(messages);

    const readable = new Readable({
      read() {},
    });

    result
      .then((res) => {
        const stream = res.data;

        stream.on('data', (chunk) => {
          const parsedString = ChatGPTModel.parseData(chunk.toString());
          readable.push(parsedString);
        });

        stream.on('end', () => {
          readable.push(null);
        });
      })
      .catch((err) => {
        // console.error(err);
      });

    return readable;
  }

  countToken(completions: Completion[]): number {
    const messages = this.mapToMessages(completions);
    return this.tokenManager.getTokenCountForMessages(messages);
  }
  static sendQuestionToModel(messages: IMessage[]): any {
    return axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        ...data,
        messages,
      },
      {
        headers,
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
