import { TagEntity } from '../../../domain/completion/tag/tag.entity';
import { Tag } from './tag';

export class TagMapper implements BaseMapper<Tag, TagEntity> {
  toEntity(model: Tag): TagEntity {
    return undefined;
  }

  toModel(entity: TagEntity): Tag {
    return undefined;
  }
}
