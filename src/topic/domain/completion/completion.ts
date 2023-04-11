import { BaseDomainModel } from '../../../common/base.domain-model';
import { CompletionProps } from '../../interface/interface';

export abstract class Completion extends BaseDomainModel<CompletionProps> {
  abstract reflectAnswerAndTokenCount(answer: string, tokenCount: number): void;
}
