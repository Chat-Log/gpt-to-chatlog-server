import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TopicOrmEntity } from '../../topic/infra/topic.orm-entity';
import { TopicEntity } from '../../topic/domain/topic.entity';
import { UserEntity } from '../domain/user.entity';

@Entity('users')
export class UserOrmEntity implements UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  phone: string;
  @Column({ nullable: true })
  gptKey: string;

  @OneToMany(() => TopicOrmEntity, (topic) => topic.user)
  topics: TopicEntity[];
}
