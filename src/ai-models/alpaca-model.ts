import { CompleteOptions } from '../common/interface/interface';
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

  askQuestion(
    user: User,
    completion: Completion,
    completeOptions: CompleteOptions,
  ): Readable {
    const messages = this.mapToMessages(completion);
    return this.alpacaModelService.sendQuestion(messages);
  }
  private mapToMessages(completion: Completion) {
    return completion.getPropsCopy().question;
  }

  countToken(completions: Completion[]): number {
    return 0;
  }
}
