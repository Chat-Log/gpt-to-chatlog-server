import { ModelProvider } from '../../../model-provider/model-provider';

export interface CompletionProps {
  id: string;
  question: string;
  model: ModelProvider;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
}
