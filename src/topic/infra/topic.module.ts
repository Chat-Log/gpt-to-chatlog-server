import { Module } from '@nestjs/common';

import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicOrmRepository } from './topic.orm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicOrmEntity } from './topic.orm-entity';
import { TagOrmEntity } from './completion/tag/tag.orm-entity';
import { CompletionOrmEntity } from './completion/completion.orm-entity';
import { TagOrmRepository } from './completion/tag/tag.orm-repository';
import { CompletionOrmRepository } from './completion/completion.orm-repository';
import { UserModule } from '../../user/infra/user.module';
import { UserService } from '../../user/infra/user.service';
import { UserOrmRepository } from '../../user/infra/user.orm-repository';
import { UserOrmEntity } from '../../user/infra/user.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicOrmEntity,
      TagOrmEntity,
      CompletionOrmEntity,
      UserOrmEntity,
    ]),
    UserModule,
  ],
  controllers: [TopicController],
  providers: [
    TopicService,
    UserService,
    UserOrmRepository,
    TopicOrmRepository,
    TagOrmRepository,
    CompletionOrmRepository,
  ],
})
export class TopicModule {}
