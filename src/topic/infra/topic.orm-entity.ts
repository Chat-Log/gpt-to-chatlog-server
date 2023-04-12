import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TopicEntity } from '../domain/topic.entity';
import { CompletionEntity } from '../domain/completion/completion.entity';
import { UserOrmEntity } from '../../user/infra/user.orm-entity';
import { CompletionOrmEntity } from './completion/completion.orm-entity';
import { UserEntity } from '../../user/domain/user.entity';
import { TagOrmEntity } from './completion/tag/tag.orm-entity';
import { TagEntity } from '../domain/completion/tag/tag.entity';

@Entity('topics')
export class TopicOrmEntity implements TopicEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CompletionOrmEntity, (completion) => completion.topic, {
    cascade: ['update', 'insert'],
  })
  completions: CompletionEntity[];

  @ManyToOne(() => UserOrmEntity, (user) => user.topics)
  user: UserEntity;

  @ManyToMany(() => TagOrmEntity, (tag) => tag.topics, {
    cascade: ['update', 'insert'],
  })
  @JoinTable()
  tags: TagEntity[];
}
