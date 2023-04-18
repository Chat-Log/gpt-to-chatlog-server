import { v4 as uuid } from 'uuid';
import { Tag } from '../../domain/tag/tag';
import { TagProps } from '../../domain/tag/tag.props';

export class TagImpl extends Tag {
  constructor(props: Partial<TagProps>) {
    super(props);
  }
  static create(name: string) {
    return new TagImpl({ id: uuid(), name });
  }
  delete(): void {
    this.props.isDeleted = true;
  }

  updateTagTitle(name: string): void {}
}
