import { ModelProvider } from '../../model-provider/model-provider';
import { Readable } from 'stream';
import { BaseDomainModel } from '../../common/base.domain-model';
import { TopicProps } from './topic.props';
import { Tag } from './tag/tag';
import { AbortSignal } from '../../common/interface/interface';

export abstract class Topic extends BaseDomainModel<TopicProps> {
  abstract changeTopicTitle(name: string): void;
  abstract askToModel(
    modelProvider: ModelProvider,
    abortSignal: AbortSignal,
    question: string,
    options?: any,
  ): Promise<Readable>;
  abstract addTags(tag: Tag[]): void;
  abstract syncTagsWithNewTagNames(
    tagNames: string[],
    deleteOtherTags?: boolean,
  ): void;
}
