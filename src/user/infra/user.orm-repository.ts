import { Injectable } from '@nestjs/common';
import { BaseOrmRepository } from '../../common/base.orm-repository';
import { User } from '../domain/user';
import { IFindOneOptions } from '../../common/interface/interface';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserOrmRepository extends BaseOrmRepository<User, UserEntity> {
  constructor(
    @InjectRepository(UserOrmEntity) repository: Repository<UserEntity>,
  ) {
    super(repository, new UserMapper());
  }

  protected getFindOneQuery(
    options: IFindOneOptions<DeepPartial<UserEntity>>,
  ): SelectQueryBuilder<UserEntity> {
    return undefined;
  }
}
