import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TopicEntity } from '../domain/topic.entity';
import { CompletionEntity } from '../domain/completion/completion.entity';
import { UserOrmEntity } from '../../user/infra/user.orm-entity';
import { CompletionOrmEntity } from './completion/completion.orm-entity';
import { UserEntity } from '../../user/domain/user.entity';

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
}
