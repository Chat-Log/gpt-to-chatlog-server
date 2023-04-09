import { ModelProvider } from '../../model-provider/model-provider';
import { Readable } from 'stream';
import { BaseDomainModel } from '../../common/base.domain-model';
import { TopicProps } from './topic.props';

export abstract class Topic extends BaseDomainModel<TopicProps> {
  abstract updateTopicTitle(name: string): void;
  abstract askToModel(modelProvider: ModelProvider, question: string): Readable;
}
