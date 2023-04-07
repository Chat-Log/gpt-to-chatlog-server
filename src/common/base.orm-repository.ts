import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import {
  IFindManyOptions,
  IFindManyResult,
  IFindOneOptions,
  IFindOneResult,
} from './interface/interface';

export abstract class BaseOrmRepository<Model, Entity> {
  protected constructor(
    protected readonly repository: Repository<Entity>,
    protected readonly mapper: BaseMapper<Model, Entity>,
  ) {}

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
    const query = this.prepareFindOneQuery(options);

    return this.mapper.toModel(await query.getOne());
  }

  public async find(
    options?: IFindManyOptions<DeepPartial<Entity>>,
  ): Promise<Model[]> {
    const query = this.prepareFindManyQuery(options);
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
    const query = this.prepareFindManyQuery(options);
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

  protected prepareFindOneQuery(
    options: IFindOneOptions<DeepPartial<Entity>>,
  ): SelectQueryBuilder<Entity> {
    const query = this.repository.createQueryBuilder();
    const { where, andWhere, orderBy, andWhere2, having } = options;

    if (having) {
      query.having(having);
    }

    if (where) {
      query.andWhere(where);
    }
    if (andWhere) {
      query.andWhere(andWhere);
    }
    if (andWhere2) {
      query.andWhere(andWhere2);
    }
    if (orderBy) {
      query.addOrderBy(orderBy.sort, orderBy.order);
    }
    this.defineRelations(query);
    return query;
  }

  protected defineRelations(queryBuilder: SelectQueryBuilder<Entity>) {}

  protected prepareFindManyQuery(
    options: IFindManyOptions<DeepPartial<Entity>>,
  ): SelectQueryBuilder<Entity> {
    return this.makeFindManyQuery(this.prepareFindOneQuery(options), options);
  }

  protected makeFindManyQuery = (
    findOneQuery: SelectQueryBuilder<any>,
    options: IFindManyOptions<any>,
  ): SelectQueryBuilder<any> => {
    const { pageIdx, pageSize, whereInIds, groupBy } = options;
    if (whereInIds) {
      findOneQuery.andWhereInIds(whereInIds);
    }
    if (pageIdx && pageSize) {
      findOneQuery.skip(pageSize * (pageIdx - 1)).take(pageSize);
    }
    if (groupBy) {
      findOneQuery.groupBy(groupBy);
    }

    return findOneQuery;
  };
}
