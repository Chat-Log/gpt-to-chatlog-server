import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import { CompletionProps } from '../../interface/interface';

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
