import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { Model } from '../../../common/enum/enum';

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
  model: Model;

  @Column()
  question: string;

  @Column()
  tokenCount: number;
}
