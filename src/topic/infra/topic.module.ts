import { Module } from '@nestjs/common';

import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicOrmRepository } from './topic.orm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicOrmEntity } from './topic.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopicOrmEntity])],
  controllers: [TopicController],
  providers: [TopicService, TopicOrmRepository],
})
export class TopicModule {}
