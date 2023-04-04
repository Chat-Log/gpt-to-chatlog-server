import { Completion } from '../domain/completion/completion';

export interface TopicProps {
  id: string;
  title: string;
  completions: Completion[];
  tags: TagProps[];
}

export interface TagProps {
  id: string;
  name: string;
}
