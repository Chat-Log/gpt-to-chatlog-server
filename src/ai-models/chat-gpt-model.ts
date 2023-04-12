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
      completion,
      ...options?.previousCompletions,
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
        console.error(err);
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

const processQueue = (queue: string[], isEnd = false, readable: Readable) => {
  let nextIndex = 0;
  const outputQueue: string[] = []; // use a separate queue to store output data

  while (queue[nextIndex] !== undefined) {
    if (nextIndex.toString() === queue[nextIndex]) {
      outputQueue.push(queue[nextIndex]);
      nextIndex++;
    } else {
      break;
    }
  }

  // remove the processed chunks from the input queue
  queue.splice(0, nextIndex);

  if (outputQueue.length > 0) {
    // push all available output data to the readable stream
    readable.push(outputQueue.join(''));
  }

  if (isEnd && queue.length > 0) {
    // if the stream has ended and there is any remaining data in the input queue, push it to the readable stream
    readable.push(queue.join(''));
  }

  if (isEnd) {
    // push null to indicate the end of the stream
    readable.push(null);
  }
};
