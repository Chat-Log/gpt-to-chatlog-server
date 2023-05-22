import * as _ from 'lodash';

export abstract class BaseDomainModel<Props> {
  protected props: Partial<Props>;
  protected constructor(props: Partial<Props>) {
    this.props = props;
  }

  public getPropsCopy(): Partial<Props> {
    return _.cloneDeep(this.props);
  }
}
