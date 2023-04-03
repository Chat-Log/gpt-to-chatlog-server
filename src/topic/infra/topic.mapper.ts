import { Topic } from '../domain/topic';
import { TopicEntity } from '../domain/topic.entity';
import { TopicOrmEntity } from './topic.orm-entity';

export class TopicMapper implements BaseMapper<Topic, TopicEntity> {
  toEntity(model: Topic): TopicEntity {
    const { id, name, completions } = model.getProps();
    const entity = new TopicOrmEntity();
    entity.name = name;
    entity.id = id;
    // entity.completions = completions;
    return entity;
  }

  toModel(entity: TopicEntity): Topic {
    return undefined;
  }
}
