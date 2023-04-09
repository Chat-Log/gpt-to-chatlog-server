import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicEntity } from '../domain/topic.entity';
import { CompletionEntity } from '../domain/completion/completion.entity';

@Entity()
export class TopicOrmEntity implements TopicEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  completions: CompletionEntity[];

  user: UserEntity;
}
