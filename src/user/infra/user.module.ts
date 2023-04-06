import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserOrmRepository } from './user.orm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [UserService, UserOrmRepository],
})
export class UserModule {}
