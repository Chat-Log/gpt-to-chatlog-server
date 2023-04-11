import { BaseDomainModel } from '../../../../common/base.domain-model';
import { TagProps } from './tag.props';

export abstract class Tag extends BaseDomainModel<TagProps> {
  protected constructor(props: Partial<TagProps>) {
    super(props);
  }
  abstract updateTagTitle(name: string): void;
}
