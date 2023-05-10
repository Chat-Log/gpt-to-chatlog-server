import { TagEntity } from '../../domain/tag/tag.entity';
import { Tag } from '../../domain/tag/tag';
import { TagImpl } from './tag';
import { TopicMapper } from '../topic.mapper';

export class TagMapper implements BaseMapper<Tag, TagEntity> {
  toEntity(model: Tag): TagEntity {
    if (!model) return;
    const { id, name, createdAt, updatedAt, topic } = model.getPropsCopy();

    return {
      id,
      name,
      createdAt,
      updatedAt,
      topic: new TopicMapper().toEntity(topic),
    };
  }

  toModel(entity: TagEntity): Tag {
    if (!entity) return;
    const { id, name, createdAt, updatedAt } = entity;
    return new TagImpl({ id, name, createdAt, updatedAt });
  }
}
