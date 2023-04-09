import { DeepPartial, SelectQueryBuilder } from 'typeorm';
import { IFindManyOptions, IFindOneOptions } from '../interface/interface';

export const getFindOneBaseQuery = (
  query: SelectQueryBuilder<any>,
  options: IFindOneOptions<any>,
) => {
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
  return query;
};
export const makeFindManyQuery = (
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
