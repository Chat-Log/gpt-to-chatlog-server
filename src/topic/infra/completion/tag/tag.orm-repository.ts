import { BaseOrmRepository } from '../../../../common/base.orm-repository';
import { Tag } from '../../../domain/completion/tag/tag';
import { IFindOneOptions } from '../../../../common/interface/interface';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { TagEntity } from '../../../domain/completion/tag/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagOrmEntity } from './tag.orm-entity';
import { TagMapper } from './tag.mapper';

export class TagOrmRepository extends BaseOrmRepository<Tag, TagEntity> {
  constructor(
    @InjectRepository(TagOrmEntity) repository: Repository<TagEntity>,
  ) {
    super(repository, new TagMapper());
  }
  protected getFindOneQuery(
    options: IFindOneOptions<DeepPartial<TagEntity>>,
  ): SelectQueryBuilder<TagEntity> {
    return undefined;
  }
}
