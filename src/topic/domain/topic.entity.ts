import { CompletionEntity } from './completion/completion.entity';
import { UserEntity } from '../../user/domain/user.entity';
import { TagEntity } from './completion/tag/tag.entity';

export interface TopicEntity {
  id: string;
  title: string;
  completions: CompletionEntity[];
  createdAt: Date;
  updatedAt: Date;
  user: UserEntity;
  tags: TagEntity[];
}
