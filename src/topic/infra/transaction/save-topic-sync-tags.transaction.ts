import { BaseTransaction } from '../../../common/transaction/base.transaction';
import { Topic } from '../../domain/topic';
import { DataSource, EntityManager } from 'typeorm';
import { TopicMapper } from '../topic.mapper';
import { TopicOrmEntity } from '../topic.orm-entity';
import { TagMapper } from '../tag/tag.mapper';
import { TagOrmEntity } from '../tag/tag.orm-entity';

interface InputData {
  topic: Topic;
}

export class SaveTopicSyncTagsTransaction extends BaseTransaction<InputData> {
  public constructor(dataSource: DataSource) {
    super(dataSource);
  }
  protected async execute(
    data: InputData,
    manager: EntityManager,
  ): Promise<any> {
    const { topic } = data;
    const { tags } = topic.getPropsCopy();
    const tagsToDelete = tags.filter((tag) => tag.getPropsCopy().isDeleted);

    const topicEntity = new TopicMapper().toEntity(topic);

    await manager.save(TopicOrmEntity, topicEntity);
    await manager.remove(
      TagOrmEntity,
      tagsToDelete.map((tagToDelete) => new TagMapper().toEntity(tagToDelete)),
    );
  }
}
