import { Completion } from 'src/topic/domain/completion/completion';
import { Tag } from 'src/topic/domain/vo/tag';

export class CompletionImpl implements Completion {
  private model: string;
  private tags: Tag[];
  private content: string;
  private prevCompletions: object;

  completeMessage(
    model: string,
    tags: string[],
    content: string,
    prevCompletions?: object,
  ) {
    throw new Error('Method not implemented.');
  }
}
