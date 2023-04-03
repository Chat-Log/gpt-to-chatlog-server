import { Completion } from 'src/topic/domain/completion/completion';
import { Readable } from 'stream';

export abstract class ModelProvider {
  abstract askQuestion(completion: Completion): Readable;
}
