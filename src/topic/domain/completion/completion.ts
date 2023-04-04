export interface Completion {
  getProps(): any;
  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void;
}
