import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { ModelName } from '../../../common/enum/enum';
import { TopicOrmEntity } from '../topic.orm-entity';
import { TopicEntity } from '../../domain/topic.entity';

@Entity('completions')
export class CompletionOrmEntity implements CompletionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  answer: string;

  @Column()
  modelName: ModelName;

  @Column()
  question: string;

  @Column()
  tokenCount: number;

  @ManyToOne(() => TopicOrmEntity, (topic) => topic.completions, {
    cascade: ['update', 'insert'],
  })
  topic: TopicEntity;
}
