import { Completion } from 'src/topic/domain/completion/completion';
import { Readable } from 'stream';
import { CompleteOptions } from '../common/interface/interface';
import { TokenManager } from '../common/util/tokenManager';

export abstract class ModelProvider {
  protected tokenManager = new TokenManager();
  abstract askQuestion(
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Readable;

  abstract countToken(completions: Completion[]): number;
}
