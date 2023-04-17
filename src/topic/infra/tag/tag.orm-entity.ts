import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { TagEntity } from '../../domain/tag/tag.entity';
import { TopicOrmEntity } from '../topic.orm-entity';
import { TopicEntity } from '../../domain/topic.entity';

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

  @ManyToOne(() => TopicOrmEntity, (topic) => topic.tags, {})
  topics: TopicEntity[];
}
