import { Observable } from 'rxjs';

interface Completion {
  completeMessage(
    model: string,
    tags: string[],
    content: string,
    prevContents?: object,
  ): any;

  // retrieveCompletions(): any;
}
