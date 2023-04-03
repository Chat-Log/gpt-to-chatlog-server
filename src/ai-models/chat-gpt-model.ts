import { Readable } from 'stream';
import axios from 'axios';
import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import Config from '../config/config';

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
  askQuestion(completion: Completion): any {
    const resultStream = new Readable({
      read() {
        axios
          .post(
            'https://api.openai.com/v1/chat/completions',
            {
              ...data,
              messages: [
                { role: 'user', content: completion.getProps().question },
              ],
            },
            {
              headers,
              responseType: 'stream',
            },
          )
          .then((response) => {
            // console.log(response);
            const stream = response.data;

            stream.on('data', (chunk) => {
              const encodedData = chunk.toString('base64');
              const decodedData = Buffer.from(encodedData, 'base64').toString(
                'utf-8',
              );
              const data = decodedData.split('data: ')[1];
              // console.log(data);
              if (data == '[DONE]') {
                stream.destroy();
                this.push(null);
                return;
              }

              if (!data) {
                // console.log('no data');
                return;
              }

              if (data.startsWith('{')) {
                const obj = JSON.parse(data);
                // console.log(obj.choices);
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
            // console.log(error);
            this.destroy();
          });
      },
    });

    return resultStream;
  }
}
