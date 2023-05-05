import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TopicEntity } from '../domain/topic.entity';
import { CompletionEntity } from '../domain/completion/completion.entity';
import { UserOrmEntity } from '../../user/infra/user.orm-entity';
import { CompletionOrmEntity } from './completion/completion.orm-entity';
import { UserEntity } from '../../user/domain/user.entity';
import { TagOrmEntity } from './tag/tag.orm-entity';
import { TagEntity } from '../domain/tag/tag.entity';

@Entity('topics')
export class TopicOrmEntity implements TopicEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CompletionOrmEntity, (completion) => completion.topic, {})
  completions: CompletionEntity[];

  @ManyToOne(() => UserOrmEntity, (user) => user.topics, { nullable: false })
  user: UserEntity;

  @OneToMany(() => TagOrmEntity, (tag) => tag.topics, {
    cascade: ['update', 'insert', 'remove'],
  })
  tags: TagEntity[];
}
