import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { Topic } from '../domain/topic';
import { TopicOrmEntity } from './topic.orm-entity';
import { TopicEntity } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';
import { BaseOrmRepository } from '../../common/base.orm-repository';
import { IFindOneOptions } from '../../common/interface/interface';

interface TopicFindOptions {
  completionIdsIn?: string[];
}
@Injectable()
export class TopicOrmRepository extends BaseOrmRepository<Topic, TopicEntity> {
  constructor(
    @InjectRepository(TopicOrmEntity)
    protected readonly repository: Repository<TopicEntity>,
  ) {
    super(repository, new TopicMapper());
  }

  public async findOneWithCompletionsAndTags(
    options: IFindOneOptions<DeepPartial<TopicEntity>> & TopicFindOptions,
  ): Promise<Topic> {
    const query = this.prepareFindOneQuery(options);
    query.leftJoinAndSelect('topic.tags', 'tags');
    query.leftJoinAndSelect('topic.completions', 'completions');

    return new TopicMapper().toModel(await query.getOne());
  }

  public async findOneWithCompletionInIds(
    options: IFindOneOptions<DeepPartial<TopicEntity>> & TopicFindOptions,
  ) {
    const query = this.prepareFindOneQuery(options);
    query.leftJoinAndSelect('topic.tags', 'tags');
    query.leftJoinAndSelect('topic.user', 'user');
    if (options?.completionIdsIn && options?.completionIdsIn.length > 0) {
      query.leftJoinAndSelect('topic.completions', 'completions');
      query.andWhere('completions.id IN (:...completionIdsIn)', {
        completionIdsIn: options.completionIdsIn,
      });
    }
    return new TopicMapper().toModel(await query.getOne());
  }

  prepareQuery(): SelectQueryBuilder<TopicEntity> {
    return this.repository.createQueryBuilder('topic');
  }
}
