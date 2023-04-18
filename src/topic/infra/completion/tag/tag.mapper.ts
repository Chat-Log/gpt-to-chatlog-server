import { TagEntity } from '../../../domain/completion/tag/tag.entity';
import { Tag } from '../../../domain/completion/tag/tag';
import { TagImpl } from './tag';

export class TagMapper implements BaseMapper<Tag, TagEntity> {
  toEntity(model: Tag): TagEntity {
    if (!model) return;
    const { id, name, createdAt, updatedAt } = model.getPropsCopy();

    return {
      id,
      name,
      createdAt,
      updatedAt,
    };
  }

  toModel(entity: TagEntity): Tag {
    if (!entity) return;
    const { id, name, createdAt, updatedAt } = entity;
    return new TagImpl({ id, name, createdAt, updatedAt });
  }
}
