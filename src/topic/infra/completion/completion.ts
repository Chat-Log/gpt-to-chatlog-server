import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import { Readable } from 'stream';

export class CompletionImpl implements Completion {
  private id: string;
  private model: ModelProvider;
  private question: string;
  private answer: string;
  private tokenCount: number;

  constructor(model: ModelProvider, question: string, answer?: string) {
    this.model = model;
    this.question = question;
    this.answer = answer;
  }

  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void {
    this.answer = answer;
    this.tokenCount = tokenCount;
  }
  getProps(): any {
    return {
      id: this.id,
      model: this.model,
      question: this.question,
      answer: this.answer,
    };
  }
  answerQuestion(): Readable {
    throw new Error('Method not implemented.');
  }

  public static createQuestion(model: ModelProvider, question: string) {
    return new CompletionImpl(model, question, null);
  }
}
