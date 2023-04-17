import { Completion } from '../../domain/completion/completion';
import { CompletionProps } from '../../domain/completion/completion.props';
import { ModelProvider } from '../../../model-provider/model-provider';

export class CompletionImpl extends Completion {
  constructor(props: Partial<CompletionProps>) {
    super(props);
  }

  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void {
    this.props.answer = answer;
    this.props.tokenCount = tokenCount;
  }

  public static createQuestion(model: ModelProvider, question: string) {
    return new CompletionImpl({ model, question });
  }
}
