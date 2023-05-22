import { ModelProvider } from './model-provider';
import { ModelName } from '../common/enum/enum';
import { Completion } from '../topic/domain/completion/completion';
import { CompleteOptions } from '../common/interface/interface';
import { Readable } from 'stream';
import { User } from '../user/domain/user';

export class MockModel extends ModelProvider {
  protected name: ModelName = ModelName['MOCK'];

  async askQuestion(
    user: User,
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Promise<Readable> {
    return new Promise((resolve) => {
      resolve(
        new Readable({
          read() {
            this.push('hello');
            this.push(null);
          },
        }),
      );
    });
  }

  countToken(completions: Completion[]): number {
    return 0;
  }
}
