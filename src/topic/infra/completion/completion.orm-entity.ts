import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { ModelName } from '../../../common/enum/enum';

@Entity()
export class CompletionOrmEntity implements CompletionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

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
}
