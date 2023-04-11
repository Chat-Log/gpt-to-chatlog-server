import { TopicEntity } from '../../topic/domain/topic.entity';
import { TagEntity } from '../../topic/domain/completion/tag/tag.entity';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  gptKey: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  topics: TopicEntity[];
  tags: TagEntity[];
}
