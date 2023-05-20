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
import { ModelName, SearchType } from '../../../common/enum/enum';

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
    console.log(options);
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
      const subQuery = this.prepareQuery()
        .select('MAX(completion.createdAt)', 'maxCreatedAt')
        // .from(CompletionOrmEntity, 'completion')
        .groupBy('completion.topicId');

      queryBuilder.andWhere(`completion.createdAt IN (${subQuery.getQuery()})`);
      Object.assign(queryBuilder.getParameters(), subQuery.getParameters());
    }
    queryBuilder.orderBy('completion.createdAt', 'DESC');
    queryBuilder.skip(pageSize * (pageIndex - 1)).take(pageSize);

    const [completions, totalCount] = await queryBuilder.getManyAndCount();

    const result = completions.map((completion) =>
      this.transformSearchResult(completion),
    );

    return [result, totalCount];
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
      .andWhere("strftime('%Y', completion.createdAt) = :year", {
        year: String(year),
      })

      .groupBy('year')
      .getRawOne();

    return {
      daily: dailyCompletionCounts,
      yearly: yearlyCompletionCounts || { year, count: 0 },
    };
  }

  async retrieveUsedTokenCount(
    userId: string,
    modelNames: ModelName[],
    year: string,
    options?: { month?: string; groupByEachModel?: boolean },
  ) {
    const queryBuilder = this.prepareQuery();

    queryBuilder.leftJoin('completion.topic', 'topic');
    queryBuilder.andWhere('topic.userId = :userId', { userId });
    if (modelNames?.length > 0) {
      queryBuilder.andWhere('completion.modelName IN (:...modelNames)', {
        modelNames,
      });
    }

    if (!year) {
      year = new Date().getFullYear().toString();
    }

    let dateCondition = '';

    if (year && options?.month) {
      const startDate = new Date(
        Number(year),
        Number(options.month) - 1,
        1,
      ).toISOString();
      const endDate = new Date(
        Number(year),
        Number(options.month),
        0,
      ).toISOString();
      dateCondition = `completion.createdAt BETWEEN '${startDate}' AND '${endDate}'`;
    } else if (year) {
      const startDate = new Date(Number(year), 0, 1).toISOString();
      const endDate = new Date(Number(year), 11, 31).toISOString();
      dateCondition = `completion.createdAt BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const query = queryBuilder
      .clone()
      .select(
        `strftime('%Y-%m-%d', completion.createdAt) as date, ${
          options?.groupByEachModel ? 'completion.modelName,' : ''
        } SUM(completion.tokenCount) as count`,
      )
      .andWhere(dateCondition)
      .groupBy(
        `date${options?.groupByEachModel ? ', completion.modelName' : ''}`,
      );

    return await query.getRawMany();
  }
}
