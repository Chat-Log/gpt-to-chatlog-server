import { ModelProvider } from '../../model-provider/model-provider';
import { Readable } from 'stream';
import { BaseDomainModel } from '../../common/base.domain-model';
import { TopicProps } from './topic.props';
import { Tag } from './completion/tag/tag';

export abstract class Topic extends BaseDomainModel<TopicProps> {
  abstract changeTopicTitle(name: string): void;
  abstract askToModel(modelProvider: ModelProvider, question: string): Readable;
  abstract addTags(tag: Tag[]): void;
  abstract syncTagsWithNewTagNames(
    tagNames: string[],
    deleteOtherTags?: boolean,
  ): void;
}
