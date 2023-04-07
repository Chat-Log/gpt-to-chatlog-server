import {
  IFindManyOptions,
  IFindManyResult,
  IFindOneOptions,
} from './interface/interface';
import { DeepPartial } from 'typeorm';

export interface BaseRepository<Model, Entity> {
  save(model: Model): Promise<Model>;

  findOne(options: IFindOneOptions<DeepPartial<Entity>>): Promise<Model>;

  find(options?: IFindManyOptions<DeepPartial<Entity>>): Promise<Model[]>;

  remove(models: Model[]): Promise<any>;

  findAndCount(
    options?: IFindManyOptions<DeepPartial<Entity>>,
  ): Promise<IFindManyResult<Model>>;
}
