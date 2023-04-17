import { BaseDomainModel } from '../../../common/base.domain-model';
import { CompletionProps } from './completion.props';

export abstract class Completion extends BaseDomainModel<CompletionProps> {
  abstract reflectAnswerAndTokenCount(answer: string, tokenCount: number): void;
}
