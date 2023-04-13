import { Topic } from '../domain/topic';
import { TopicEntity } from '../domain/topic.entity';
import { CompletionMapper } from './completion/completion.mapper';
import { UserMapper } from '../../user/infra/user.mapper';
import { TopicImpl } from './topic';
import { TagMapper } from './completion/tag/tag.mapper';

export class TopicMapper implements BaseMapper<Topic, TopicEntity> {
  toEntity(model: Topic): TopicEntity {
    if (!model) return;
    const { id, title, completions, updatedAt, user, createdAt, tags } =
      model.getPropsCopy();

    return {
      title,
      id,
      completions: completions?.map((completion) =>
        new CompletionMapper().toEntity(completion),
      ),
      user: new UserMapper().toEntity(user),
      createdAt,
      updatedAt,
      tags: tags?.map((tag) => new TagMapper().toEntity(tag)),
    };
  }

  toModel(entity: TopicEntity): Topic {
    console.log(entity);
    if (!entity) return;
    const { id, title, completions, updatedAt, user, createdAt } = entity;
    return new TopicImpl({
      id,
      title,
      completions: completions?.map((completion) =>
        new CompletionMapper().toModel(completion),
      ),
      user: new UserMapper().toModel(user),
      createdAt,
      updatedAt,
    });
  }
}
