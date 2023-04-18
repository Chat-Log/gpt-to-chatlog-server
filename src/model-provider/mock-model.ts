import { ModelProvider } from './model-provider';
import { ModelName } from '../common/enum/enum';
import { Completion } from '../topic/domain/completion/completion';
import { CompleteOptions } from '../common/interface/interface';
import { Readable } from 'stream';

export class MockModel extends ModelProvider {
  protected name: ModelName = ModelName['MOCK'];

  askQuestion(
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Readable {
    return new Readable({
      read() {
        this.push('hello');
        this.push(null);
      },
    });
  }

  countToken(completions: Completion[]): number {
    return 0;
  }
}
