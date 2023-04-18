import { BaseOrmRepository } from '../../../common/base.orm-repository';
import { Tag } from '../../domain/tag/tag';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TagEntity } from '../../domain/tag/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagOrmEntity } from './tag.orm-entity';
import { TagMapper } from './tag.mapper';

export class TagOrmRepository extends BaseOrmRepository<Tag, TagEntity> {
  constructor(
    @InjectRepository(TagOrmEntity) repository: Repository<TagEntity>,
  ) {
    super(repository, new TagMapper());
  }

  prepareQuery(): SelectQueryBuilder<TagEntity> {
    return this.repository.createQueryBuilder('tag');
  }

  async findAllTagsByUserId(userId: string): Promise<string[]> {
    const queryBuilder = this.prepareQuery();
    queryBuilder
      .select('tag.name', 'name')
      .leftJoin('tag.topics', 'topic')
      .andWhere(`topic.userId = :userId`, { userId });
    queryBuilder.distinct(true);
    const tags = await queryBuilder.getRawMany();
    return tags.map((tag) => tag.name);
  }
}
