import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { TagEntity } from '../../../domain/completion/tag/tag.entity';

@Entity()
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
}
