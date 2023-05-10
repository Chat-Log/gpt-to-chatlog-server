import { Topic } from '../topic';

export interface TagProps {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  topic: Topic;
}
