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
  n: 1,
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Config.chatGptApiKey}`,
};

export class ChatGPTModel extends ModelProvider {
  protected name = ModelName['GPT3.5_TURBO'];
  askQuestion(completion: Completion, options?: CompleteOptions): any {
    const messages = this.mapToMessages([
      completion,
      ...options?.previousCompletions,
    ]);
    const resultStream = new Readable({
      read() {
        axios
          .post(
            'https://api.openai.com/v1/chat/completions',
            {
              ...data,
              messages,
            },
            {
              headers,
              responseType: 'stream',
            },
          )
          .then((response) => {
            const stream = response.data;

            stream.on('data', (chunk) => {
              const encodedData = chunk.toString('base64');
              const decodedData = Buffer.from(encodedData, 'base64').toString(
                'utf-8',
              );
              const data = decodedData.split('data: ')[1];
              if (data == '[DONE]') {
                stream.destroy();
                this.push(null);
                return;
              }

              if (!data) {
                return;
              }

              if (data.startsWith('{')) {
                const obj = JSON.parse(data);
                const writeData = obj.choices && obj.choices[0].delta.content;
                if (writeData) {
                  this.push(writeData);
                }
              }
            });

            stream.on('end', () => {
              // console.log('stream ended');
              this.push(null);
            });

            stream.on('error', (error) => {
              // console.log(error);
              this.push(null);
            });
          })
          .catch((error) => {
            console.log(error);
            this.destroy();
          });
      },
    });

    return resultStream;
  }

  countToken(completions: Completion[]): number {
    const messages = this.mapToMessages(completions);
    return this.tokenManager.getTokenCountForMessages(messages);
  }

  mapToMessages(completions: Completion[]): IMessage[] {
    const len = completions.length;
    const messages = completions.map((completion, idx) => {
      if (idx == len - 1) {
        return [
          {
            role: 'user',
            content: completion.getPropsCopy().question,
          },
        ];
      }
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
    return messages.flat();
  }
}
