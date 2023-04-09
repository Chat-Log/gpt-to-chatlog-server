import { Completion } from '../../domain/completion/completion';
import { CompletionEntity } from '../../domain/completion/completion.entity';

export class CompletionMapper
  implements BaseMapper<Completion, CompletionEntity>
{
  toEntity(model: Completion): CompletionEntity {
    return undefined;
  }

  toModel(entity: CompletionEntity): Completion {
    return undefined;
  }
}
