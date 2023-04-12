import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { TagEntity } from '../../../domain/completion/tag/tag.entity';
import { TopicOrmEntity } from '../../topic.orm-entity';
import { TopicEntity } from '../../../domain/topic.entity';

@Entity('tags')
export class TagOrmEntity implements TagEntity {
  @PrimaryColumn()
  @IsUUID(4)
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => TopicOrmEntity, (topic) => topic.tags, {})
  topics: TopicEntity[];
}
