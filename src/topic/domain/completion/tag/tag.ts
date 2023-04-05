import { uuidV4 as uuid } from 'uuid';
import { TagProps } from '../../../interface/interface';
export class Tag {
  private readonly id;
  private readonly name: string;
  constructor(id: string, name: string) {
    this.name = name;
  }
  static createTag(name: string) {
    return new Tag(uuid(), name);
  }
  public getProps(): TagProps {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
