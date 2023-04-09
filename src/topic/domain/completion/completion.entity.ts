import { Model } from '../../../common/enum/enum';

export interface CompletionEntity {
  id: string;
  model: Model;
  question: string;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
}
