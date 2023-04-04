import { TopicProps } from '../interface/interface';
import { ModelProvider } from '../../model-provider/model-provider';
import { Readable } from 'stream';

export interface Topic {
  updateTopicTitle(name: string): void;
  getProps(): TopicProps;
  askToModel(modelProvider: ModelProvider, question: string): Readable;
}
