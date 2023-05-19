import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { Topic } from '../domain/topic';
import { TopicOrmEntity } from './topic.orm-entity';
import { TopicEntity } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';
import { BaseOrmRepository } from '../../common/base.orm-repository';
import {
  IFindOneOptions,
  RetrieveRecentTopicsTitleResult,
} from '../../common/interface/interface';

interface TopicFindOptions {
  completionReferCount?: number;
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

  public async findOneWithPreviousCompletions(
    options: IFindOneOptions<DeepPartial<TopicEntity>> & TopicFindOptions,
  ) {
    const query = this.prepareFindOneQuery(options);
    query.leftJoinAndSelect('topic.tags', 'tags');
    query.leftJoinAndSelect('topic.user', 'user');
    if (options?.completionReferCount) {
      query.leftJoinAndSelect(
        'topic.completions',
        'completions',
        'completions.id IN ' +
          '(SELECT id FROM completions WHERE topicId = topic.id ORDER BY createdAt DESC LIMIT :completionReferCount)',
        { completionReferCount: options.completionReferCount },
      );
    }
    return new TopicMapper().toModel(await query.getOne());
  }

  prepareQuery(): SelectQueryBuilder<TopicEntity> {
    return this.repository.createQueryBuilder('topic');
  }

  async retrieveRecentTopicsTitle(
    userId: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<RetrieveRecentTopicsTitleResult[]> {
    const query = this.prepareFindManyQuery({
      pageSize,
      pageIdx: pageIndex,
      where: { user: { id: userId } },
      orderBy: {
        order: 'DESC',
        sort: 'topic.createdAt',
      },
    });
    query.select(['topic.title', 'topic.id']);
    const result = await query.getMany();
    return result.map((topic) =>
      this.mapToRetrieveRecentTopicsTitleResult(topic),
    );
  }
  private mapToRetrieveRecentTopicsTitleResult(
    topic: TopicEntity,
  ): RetrieveRecentTopicsTitleResult {
    return {
      id: topic.id,
      title: topic.title,
    };
  }
}
