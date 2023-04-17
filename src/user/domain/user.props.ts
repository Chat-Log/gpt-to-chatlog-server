import { Topic } from '../../topic/domain/topic';
import { Tag } from '../../topic/domain/tag/tag';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  gptKey: string;
  topics: Topic[];
  tags: Tag[];
}
