import { CompleteOptions } from '../common/interface/interface';
import { TokenManager } from '../common/util/tokenManager';
import { ModelName } from '../common/enum/enum';
import { Completion } from '../topic/domain/completion/completion';
import { User } from '../user/domain/user';
import { Readable } from 'stream';

export abstract class ModelProvider {
  protected tokenManager = new TokenManager();
  protected abstract name: ModelName;
  abstract askQuestion(
    user: User,
    abortSignal: { isAborted: boolean },
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Promise<Readable>;

  abstract countToken(completions: Completion[]): number;

  getName(): ModelName {
    return this.name;
  }
}
