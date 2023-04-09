import { CompletionMapper } from './completion.mapper';
import { CompletionOrmEntity } from './completion.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Completion } from '../../domain/completion/completion';
import { BaseOrmRepository } from '../../../common/base.orm-repository';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { IFindOneOptions } from '../../../common/interface/interface';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompletionOrmRepository extends BaseOrmRepository<
  Completion,
  CompletionEntity
> {
  constructor(
    @InjectRepository(CompletionOrmEntity)
    repository: Repository<CompletionEntity>,
  ) {
    super(repository, new CompletionMapper());
  }
  protected getFindOneQuery(
    options: IFindOneOptions<DeepPartial<CompletionEntity>>,
  ): SelectQueryBuilder<CompletionEntity> {
    return undefined;
  }
}
