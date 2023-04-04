import { DeepPartial } from 'typeorm';
import { Completion } from '../../topic/domain/completion/completion';

export interface IFindManyResult<Model> {
  data: Model[];
  metadata: {
    totalCnt: number;
    pageIdx: number;
  };
}
export interface IFindOneResult<Model> {
  data: Model;
  metadata: {};
}

export interface IFindManyOptions<Entity> extends IFindOneOptions<Entity> {
  pageSize?: number;
  pageIdx?: number;
  whereInIds?: string[] | number[];
  groupBy?: string;
}
export interface IFindOptionWhere<Entity> {
  where?: DeepPartial<Entity> | string;
  andWhere?: DeepPartial<Entity> | string;
  andWhere2?: string;
}

export interface IFindOneOptions<Entity> extends IFindOptionWhere<Entity> {
  relations?: {
    [P in keyof Entity]?: boolean;
  };
  andRelations?: string;
  andRelations2?: string;
  select?: { target: string; alias?: string };
  orderBy?: { sort: string; order?: 'ASC' | 'DESC' };
  having?: string;
}

export interface IMessage {
  role: string;
  content: string;
  name?: string;
}

export interface CompleteOptions {
  previousCompletions: Completion[];
}
