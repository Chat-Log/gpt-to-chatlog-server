import { ModelName } from '../../../common/enum/enum';
import { TopicEntity } from '../topic.entity';

export interface CompletionEntity {
  id: string;
  modelName: ModelName;
  question: string;
  answer: string;
  tokenCount: number;
  createdAt: Date;
  updatedAt: Date;
  topic: TopicEntity;
}
