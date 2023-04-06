import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { Topic } from '../domain/topic';
import { TopicOrmEntity } from './topic.orm-entity';
import { TopicEntity } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';
import { BaseOrmRepository } from '../../common/base.orm-repository';
import { IFindOneOptions } from '../../common/interface/interface';

@Injectable()
export class TopicOrmRepository extends BaseOrmRepository<Topic, TopicEntity> {
  constructor(
    @InjectRepository(TopicOrmEntity)
    protected readonly repository: Repository<TopicEntity>,
  ) {
    super(repository, new TopicMapper());
  }

  protected getFindOneQuery(
    options: IFindOneOptions<DeepPartial<TopicEntity>>,
  ): SelectQueryBuilder<TopicEntity> {
    return undefined;
  }
}
