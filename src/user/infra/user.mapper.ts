import { User } from '../domain/user';
import { UserImpl } from './user';
import { UserEntity } from '../domain/user.entity';
import { TopicMapper } from '../../topic/infra/topic.mapper';
import { TagMapper } from '../../topic/infra/completion/tag/tag.mapper';

export class UserMapper implements BaseMapper<User, UserEntity> {
  toEntity(model: User): UserEntity {
    if (!model) return null;
    const {
      id,
      email,
      password,
      gptKey,
      phone,
      name,
      createdAt,
      updatedAt,
      topics,
      tags,
    } = model.getPropsCopy();
    return {
      gptKey,
      createdAt,
      name,
      phone,
      updatedAt,
      id,
      email,
      password,
      topics: topics?.map((topic) => new TopicMapper().toEntity(topic)),
      tags: tags?.map((tag) => new TagMapper().toEntity(tag)),
    };
  }

  toModel(entity: UserEntity): User {
    if (!entity) return null;
    const user = new UserImpl({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      gptKey: entity.gptKey,
      phone: entity.phone,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return user;
  }
}
