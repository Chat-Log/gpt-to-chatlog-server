import { ModelName } from '../../../common/enum/enum';

export interface CompletionEntity {
  id: string;
  modelName: ModelName;
  question: string;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
}
