import { TopicEntity } from '../topic.entity';

export interface TagEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  topic: TopicEntity;
}
