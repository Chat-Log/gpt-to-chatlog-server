import { Completion } from '../../domain/completion/completion';
import { CompletionEntity } from '../../domain/completion/completion.entity';
import { CompletionImpl } from './completion';
import { chooseModel } from '../../../common/util/util';

export class CompletionMapper
  implements BaseMapper<Completion, CompletionEntity>
{
  toEntity(completion: Completion): CompletionEntity {
    if (!completion) return;
    const { id, answer, tokenCount, createdAt, updatedAt, model, question } =
      completion.getPropsCopy();
    return {
      id,
      answer,
      tokenCount,
      createdAt,
      updatedAt,
      modelName: model?.getName(),
      question,
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
