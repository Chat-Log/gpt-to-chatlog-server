import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TopicEntity } from '../domain/topic.entity';

@Entity()
export class TopicOrmEntity implements TopicEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;
}
