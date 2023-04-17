import { Completion } from './completion/completion';
import { Tag } from './tag/tag';
import { User } from '../../user/domain/user';

export interface TopicProps {
  id: string;
  title: string;
  completions: Completion[];
  tags: Tag[];
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
