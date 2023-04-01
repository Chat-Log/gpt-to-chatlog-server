import { Observable } from 'rxjs';

export interface Completion {
  completeMessage(
    model: string,
    tags: string[],
    content: string,
    prevCompletions?: object,
  ): any;
}
