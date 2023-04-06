import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import { Readable } from 'stream';
import { CompletionProps } from '../../interface/interface';

export class CompletionImpl implements Completion {
  private id: string;
  private model: ModelProvider;
  private question: string;
  private answer: string;
  private tokenCount: number;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(model: ModelProvider, question: string, answer?: string) {
    this.model = model;
    this.question = question;
    this.answer = answer;
  }

  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void {
    this.answer = answer;
    this.tokenCount = tokenCount;
  }
  getProps(): CompletionProps {
    return {
      id: this.id,
      question: this.question,
      model: this.model,
      answer: this.answer,
      tokenCount: this.tokenCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  answerQuestion(): Readable {
    throw new Error('Method not implemented.');
  }

  public static createQuestion(model: ModelProvider, question: string) {
    return new CompletionImpl(model, question, null);
  }
}
