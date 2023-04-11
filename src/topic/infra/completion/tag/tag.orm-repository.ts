import { BaseOrmRepository } from '../../../../common/base.orm-repository';
import { Tag } from '../../../domain/completion/tag/tag';
import { Repository } from 'typeorm';
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

  async findTagInNames(userId, names: string[]): Promise<Tag[]> {
    const tags = await this.repository
      .createQueryBuilder('tag')
      .where('tag.name IN (:...names)', {
        names,
      })
      .andWhere('tag.userId = :userId', { userId })
      .getMany();
    return tags.map((tag) => this.mapper.toModel(tag));
  }
}
