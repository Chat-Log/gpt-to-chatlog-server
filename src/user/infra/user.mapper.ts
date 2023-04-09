import { User } from '../domain/user';
import { UserImpl } from './user';

export class UserMapper implements BaseMapper<User, UserEntity> {
  toEntity(model: User): UserEntity {
    if (!model) return null;
    const { id, email, password, apiKey, phone, name, createdAt, updatedAt } =
      model.getPropsCopy();
    return {
      apiKey,
      createdAt,
      name,
      phone,
      updatedAt,
      id,
      email,
      password,
    };
  }

  toModel(entity: UserEntity): User {
    if (!entity) return null;
    const user = new UserImpl({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      apiKey: entity.apiKey,
      phone: entity.phone,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return user;
  }
}
