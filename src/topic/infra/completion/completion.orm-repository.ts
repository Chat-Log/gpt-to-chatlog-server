import { CompletionMapper } from './completion.mapper';
import { CompletionOrmEntity } from './completion.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Completion } from '../../domain/completion/completion';
import { BaseOrmRepository } from '../../../common/base.orm-repository';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  RetrieveDailyCompletionCountsResult,
  SearchCompletionsWithTopicOptions,
  SearchCompletionsWithTopicResult,
} from '../../../common/interface/interface';
import { SearchType } from '../../../common/enum/enum';

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

  prepareQuery(): SelectQueryBuilder<CompletionEntity> {
    return this.repository.createQueryBuilder('completion');
  }

  async searchCompletionsWithTopic(
    options: SearchCompletionsWithTopicOptions,
  ): Promise<[SearchCompletionsWithTopicResult[], number]> {
    const {
      tagNames,
      modelNames,
      pageSize = 10,
      pageIndex = 1,
      query,
      date,
      searchType,
      onlyLastCompletions,
    } = options;
    const queryBuilder = this.prepareQuery();
    queryBuilder.leftJoinAndSelect('completion.topic', 'topic');
    queryBuilder.leftJoinAndSelect('topic.tags', 'tag');

    if (tagNames?.length > 0) {
      queryBuilder.andWhere('tag.name IN (:...tagNames)', { tagNames });
    }
    if (modelNames?.length > 0) {
      queryBuilder.andWhere('completion.modelName IN (:...modelNames)', {
        modelNames,
      });
    }
    if (query) {
      if (searchType === SearchType.QUESTION) {
        queryBuilder.andWhere('completion.question LIKE :query', {
          query: `%${query}%`,
        });
      } else if (searchType === SearchType.ANSWER) {
        queryBuilder.andWhere('completion.answer LIKE :query', {
          query: `%${query}%`,
        });
      } else if (searchType === SearchType.TOPIC_TITLE) {
        queryBuilder.andWhere('topic.title LIKE :query', {
          query: `%${query}%`,
        });
      } else if (searchType === SearchType.ALL) {
        queryBuilder.andWhere(
          '(completion.question LIKE :query OR completion.answer LIKE :query OR topic.title LIKE :query)',
          { query: `%${query}%` },
        );
      }
    }
    if (date) {
      const startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );
      queryBuilder.andWhere(
        `(completion.createdAt >= :startDate AND completion.createdAt < :endDate)`,
        { startDate, endDate },
      );
    }
    if (onlyLastCompletions) {
      console.log('hi');
      const subQuery = this.prepareQuery()
        .select('MAX(completion.createdAt)', 'maxCreatedAt')
        // .from(CompletionOrmEntity, 'completion')
        .groupBy('completion.topicId');

      queryBuilder.andWhere(`completion.createdAt IN (${subQuery.getQuery()})`);
      Object.assign(queryBuilder.getParameters(), subQuery.getParameters());
    }
    queryBuilder.skip((pageIndex - 1) * pageSize);

    const [completions, count] = await queryBuilder.getManyAndCount();

    const result = completions.map((completion) =>
      this.transformSearchResult(completion),
    );

    return [result, count];
  }
  private transformSearchResult(
    completion: CompletionOrmEntity,
  ): SearchCompletionsWithTopicResult {
    if (!completion) return;
    return {
      completionId: completion.id,
      question: completion.question,
      answer: completion.answer,
      topicTitle: completion.topic?.title,
      tagNames: completion.topic?.tags?.map((tag) => tag.name),
      createdAt: completion.createdAt,
      modelName: completion.modelName,
    };
  }

  async retrieveDailyCompletionCounts(
    userId: string,
    year: string | null,
  ): Promise<RetrieveDailyCompletionCountsResult> {
    const queryBuilder = this.prepareQuery();
    queryBuilder.leftJoinAndSelect('completion.topic', 'topic');
    queryBuilder.andWhere('topic.userId = :userId', { userId });

    if (!year) {
      year = new Date().getFullYear().toString();
    }

    const dailyCompletionCounts = await queryBuilder
      .clone()
      .select(
        "strftime('%Y-%m-%d', completion.createdAt) as date, COUNT(completion.id) as count",
      )
      .andWhere("strftime('%Y', completion.createdAt) = :year", {
        year: String(year),
      })
      .groupBy('date')
      .getRawMany();

    const yearlyCompletionCounts = await queryBuilder
      .clone()
      .select(
        "strftime('%Y', completion.createdAt) as year, COUNT(completion.id) as count",
      )
      .groupBy('year')
      .getRawMany();

    return {
      daily: dailyCompletionCounts,
      yearly: yearlyCompletionCounts,
    };
  }
}
