import { Injectable } from '@nestjs/common';
import { BaseOrmRepository } from '../../common/base.orm-repository';
import { User } from '../domain/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';
import { UserEntity } from '../domain/user.entity';

@Injectable()
export class UserOrmRepository extends BaseOrmRepository<User, UserEntity> {
  constructor(
    @InjectRepository(UserOrmEntity) repository: Repository<UserEntity>,
  ) {
    super(repository, new UserMapper());
  }
}
