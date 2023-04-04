import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { Topic } from '../domain/topic';
import { TopicOrmEntity } from './topic.orm-entity';
import { TopicEntity } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';
import { BaseRepository } from '../../common/base.repository';
import { IFindOneOptions } from '../../common/interface/interface';

@Injectable()
export class TopicRepository extends BaseRepository<Topic, TopicEntity> {
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
