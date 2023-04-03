import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../domain/topic';
import { TopicOrmEntity } from './topic.orm-entity';
import { TopicEntity } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';

@Injectable()
export class TopicRepository {
  mapper: BaseMapper<Topic, TopicEntity>;
  constructor(
    @InjectRepository(TopicOrmEntity)
    private readonly repository: Repository<TopicEntity>,
  ) {
    this.mapper = new TopicMapper();
  }

  async save(topic: Topic): Promise<Topic> {
    const entity = this.mapper.toEntity(topic);
    await this.repository.save(entity);
    // return this.mapper.toModel(await this.repository.save(topic);)
    return undefined;
  }

  async find() {
    return await this.repository.find();
  }
}
