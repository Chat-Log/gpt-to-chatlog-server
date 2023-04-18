import { TopicEntity } from '../../topic/domain/topic.entity';

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
}
