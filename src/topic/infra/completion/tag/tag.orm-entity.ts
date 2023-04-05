import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsUUID } from 'class-validator';
import { TagEntity } from '../../../domain/completion/tag/tag.entity';

@Entity()
export class TagOrmEntity implements TagEntity {
  @PrimaryColumn()
  @IsUUID(4)
  id: string;

  @Column()
  name: string;
}
