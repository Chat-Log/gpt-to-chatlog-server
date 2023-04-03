import { Completion } from '../domain/completion/completion';

export interface CompleteOptions {
  maxTokenCount: number;
  baseUrl: string;
  stream: boolean;
  n: number;
}

export interface TopicProps {
  id: number;
  name: string;
  completions: Completion[];
}
