import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import {
  IFindManyOptions,
  IFindManyResult,
  IFindOneOptions,
  IFindOneResult,
} from './interface/interface';
import { makeFindManyQuery } from './util/util';

export abstract class BaseRepository<Model, Entity> {
  protected constructor(
    protected readonly repository: Repository<Entity>,
    protected readonly mapper: BaseMapper<Model, Entity>,
  ) {}

  protected abstract getFindOneQuery(
    options: IFindOneOptions<DeepPartial<Entity>>,
  ): SelectQueryBuilder<Entity>;

  protected getFindManyQuery(
    options: IFindOneOptions<DeepPartial<Entity>>,
  ): SelectQueryBuilder<Entity> {
    return makeFindManyQuery(this.getFindOneQuery(options), options);
  }
  public async save(model: Model): Promise<Model> {
    const entity = this.mapper.toEntity(model);
    try {
      return this.mapper.toModel(await this.repository.save(entity));
    } catch (err) {
      console.log(err);

      if (err.code === '23505') throw new Error();
      else {
        throw new Error('저장에 실패했습니다');
      }
    }
  }
  public async findOne(
    options: IFindOneOptions<DeepPartial<Entity>>,
  ): Promise<Model> {
    const query = this.getFindOneQuery(options);

    return this.mapper.toModel(await query.getOne());
  }

  public async find(
    options?: IFindManyOptions<DeepPartial<Entity>>,
  ): Promise<Model[]> {
    const query = this.getFindManyQuery(options);
    return (await query.getMany()).map((entity) => {
      return this.mapper.toModel(entity);
    });
  }

  public async remove(models: Model[]): Promise<any> {
    const entities = models.map((model) => this.mapper.toEntity(model));
    try {
      return await this.repository.remove(entities);
    } catch (err) {
      if (err.code === '23503') throw new Error();
      else {
        throw new Error();
      }
    }
  }

  public async findAndCount(
    options: IFindManyOptions<DeepPartial<Entity>>,
  ): Promise<IFindManyResult<Model>> {
    const query = this.getFindManyQuery(options);
    const { pageIdx } = options;

    const [list, totalCnt] = await query.getManyAndCount();
    return {
      metadata: { totalCnt, pageIdx },
      data: list.map((item) => this.mapper.toModel(item)),
    };
  }
  public async findOneAndMetadata(
    options: IFindOneOptions<DeepPartial<Entity>>,
  ): Promise<IFindOneResult<Model>> {
    return {
      data: await this.findOne(options),
      metadata: {},
    };
  }
}
