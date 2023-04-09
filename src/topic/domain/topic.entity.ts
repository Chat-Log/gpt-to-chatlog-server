import { CompletionEntity } from './completion/completion.entity';

export interface TopicEntity {
  id: string;
  title: string;
  completions: CompletionEntity[];
  user: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
