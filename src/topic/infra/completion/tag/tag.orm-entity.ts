import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { TagEntity } from '../../../domain/completion/tag/tag.entity';
import { UserOrmEntity } from '../../../../user/infra/user.orm-entity';

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

  @ManyToOne(() => UserOrmEntity, (user) => user.tags)
  user: UserOrmEntity;
}
