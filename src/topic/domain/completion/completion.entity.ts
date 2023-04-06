export interface CompletionEntity {
  id: string;
  model: string;
  question: string;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
}
