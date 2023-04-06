import { Completion } from '../domain/completion/completion';
import { ModelProvider } from '../../model-provider/model-provider';

export interface TopicProps {
  id: string;
  title: string;
  completions: Completion[];
  tags: TagProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TagProps {
  id: string;
  name: string;
}

export interface CompletionProps {
  id: string;
  question: string;
  model: ModelProvider;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
}
