import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompletionEntity } from '../../domain/completion/completion.entity';

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
  model: string;

  @Column()
  question: string;

  @Column()
  tokenCount: number;
}
