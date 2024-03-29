import { AbortSignal, CompleteOptions } from '../common/interface/interface';
import { ModelName } from '../common/enum/enum';
import { ModelProvider } from '../model-provider/model-provider';
import { Completion } from '../topic/domain/completion/completion';
import { AlpacaModelService } from './alpaca/alpaca-model.service';
import { User } from '../user/domain/user';
import { Readable } from 'stream';

export class AlpacaModel extends ModelProvider {
  alpacaModelService = AlpacaModelService.getInstance();
  constructor() {
    super();
  }
  protected name = ModelName['ALPACA'];

  async askQuestion(
    user: User,
    abortSignal: AbortSignal,
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Promise<Readable> {
    const messages = this.mapToMessages(completion);
    return this.alpacaModelService.sendQuestion(messages, abortSignal);
  }
  private mapToMessages(completion: Completion) {
    return completion.getPropsCopy().question;
  }

  countToken(completions: Completion[]): number {
    return 0;
  }
}
