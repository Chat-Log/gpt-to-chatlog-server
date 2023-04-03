import { Readable } from 'stream';

export interface Completion {
  answerQuestion(): Readable;
  getProps(): any;
}
