export abstract class BaseDomainModel<Props> {
  protected constructor(protected props: Partial<Props>) {}

  public getPropsCopy(): Partial<Props> {
    return Object.freeze(this.props);
  }
}
