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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicOrmEntity,
      TagOrmEntity,
      CompletionOrmEntity,
    ]),
  ],
  controllers: [TopicController],
  providers: [
    TopicService,
    TopicOrmRepository,
    TagOrmRepository,
    CompletionOrmRepository,
  ],
})
export class TopicModule {}
