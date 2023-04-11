import { CompletionEntity } from './completion/completion.entity';
import { UserEntity } from '../../user/domain/user.entity';

export interface TopicEntity {
  id: string;
  title: string;
  completions: CompletionEntity[];
  createdAt: Date;
  updatedAt: Date;
  user: UserEntity;
}
