import { User } from '../domain/user';

export class UserMapper implements BaseMapper<User, UserEntity> {
  toEntity(model: User): UserEntity {
    return undefined;
  }

  toModel(entity: UserEntity): User {
    return undefined;
  }
}
