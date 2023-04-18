import { Completion } from '../../domain/completion/completion';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { CompletionImpl } from './completion';
import { chooseModel } from '../../../common/util/util';
import { TopicMapper } from '../topic.mapper';

export class CompletionMapper
  implements BaseMapper<Completion, CompletionEntity>
{
  toEntity(completion: Completion): CompletionEntity {
    if (!completion) return;
    const {
      id,
      answer,
      tokenCount,
      createdAt,
      updatedAt,
      model,
      question,
      topic,
    } = completion.getPropsCopy();
    return {
      id,
      answer,
      tokenCount,
      createdAt,
      updatedAt,
      modelName: model?.getName(),
      question,
      topic: new TopicMapper().toEntity(topic),
    };
  }

  toModel(entity: CompletionEntity): Completion {
    if (!entity) return;
    const {
      id,
      answer,
      tokenCount,
      createdAt,
      updatedAt,
      modelName,
      question,
    } = entity;
    return new CompletionImpl({
      id,
      answer,
      tokenCount,
      createdAt,
      updatedAt,
      model: chooseModel(modelName),
      question,
    });
  }
}
