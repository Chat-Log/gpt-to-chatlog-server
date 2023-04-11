import { uuidV4 as uuid } from 'uuid';
import { Tag } from '../../../domain/completion/tag/tag';
import { TagProps } from '../../../domain/completion/tag/tag.props';
import { Topic } from '../../../domain/topic';

export class TagImpl extends Tag {
  constructor(props: Partial<TagProps>) {
    super(props);
  }
  static createTag(name: string, topic: Topic) {
    return new TagImpl({ id: uuid(), name });
  }

  updateTagTitle(name: string): void {}
}
