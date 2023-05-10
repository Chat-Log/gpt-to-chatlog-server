import { BaseTransaction } from '../../../common/transaction/base.transaction';
import { Topic } from '../../domain/topic';
import { DataSource, EntityManager } from 'typeorm';
import { TopicMapper } from '../topic.mapper';
import { TagOrmEntity } from '../tag/tag.orm-entity';
import { TagMapper } from '../tag/tag.mapper';
import { CompletionOrmEntity } from '../completion/completion.orm-entity';
import { TopicOrmEntity } from '../topic.orm-entity';

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
    const completion =
      topicEntity.completions[topicEntity.completions.length - 1];
    completion.topic = topicEntity;
    await manager.upsert(TopicOrmEntity, topicEntity, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
    const tagEntities = topicEntity.tags;
    tagEntities.forEach((tagEntity) => {
      tagEntity.topic = topicEntity;
    });

    try {
      await manager.insert(CompletionOrmEntity, completion);
      await manager.upsert(TagOrmEntity, tagEntities, {
        conflictPaths: ['id'],
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (err) {
      console.log(err);
    }
    await manager.remove(
      TagOrmEntity,
      tagsToDelete.map((tagToDelete) => new TagMapper().toEntity(tagToDelete)),
    );
  }
}
