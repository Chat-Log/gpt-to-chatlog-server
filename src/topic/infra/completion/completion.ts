import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from 'src/topic/domain/completion/completion';
import { Readable } from 'stream';

export class CompletionImpl implements Completion {
  private id: string;
  private model: ModelProvider;
  private prevCompletions: Completion[];
  private question: string;
  private answer: string;

  constructor(
    model: ModelProvider,
    question: string,
    answer?: string,
    prevCompletions?: Completion[],
  ) {
    this.model = model;
    this.question = question;
    this.answer = answer;
    this.prevCompletions = prevCompletions;
  }
  static askQuestion(model: ModelProvider, question: string): Readable {
    return model.askQuestion(new CompletionImpl(model, question, null, null));
  }

  writeAnswer(answer: string): void {
    this.answer = answer;
  }
  getProps(): any {
    return {
      id: this.id,
      model: this.model,
      prevCompletions: this.prevCompletions,
      question: this.question,
      answer: this.answer,
    };
  }
  answerQuestion(): Readable {
    throw new Error('Method not implemented.');
  }

  public static createCompletion(
    model: ModelProvider,
    question: string,
    prevCompletions?: Completion[],
  ) {
    const newCompletion = new CompletionImpl(
      model,
      question,
      null,
      prevCompletions,
    );

    return newCompletion;
  }
}
