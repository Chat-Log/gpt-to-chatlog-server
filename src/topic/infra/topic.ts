import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from '../domain/completion/completion';
import { Topic } from '../domain/topic';
import { CompletionImpl } from './completion/completion';
import { User } from '../../user/domain/user';
import { v4 as uuid } from 'uuid';
import { Tag } from '../domain/tag/tag';
import { Readable } from 'stream';
import { TopicProps } from '../domain/topic.props';
import { TagImpl } from './tag/tag';

interface AskOptions {
  changeTopicTitleRequired: boolean;
}
export class TopicImpl extends Topic {
  constructor(props: Partial<TopicProps>) {
    super(props);
  }
  changeTopicTitle(title: string): void {
    this.props.title = title;
  }

  static createTopic(tagNames: string[], user: User): Topic {
    return new TopicImpl({
      tags: tagNames.map((tagName) => TagImpl.create(tagName)),
      user,
      id: uuid(),
    });
  }
  private getCurrentCompletion(): Completion {
    return this.props.completions[this.props.completions.length - 1];
  }
  private getPreviousCompletions(): Completion[] {
    return this.props.completions.slice(0, this.props.completions.length - 1);
  }
  async askToModel(
    modelProvider: ModelProvider,
    question: string,
    options?: AskOptions,
  ): Promise<Readable> {
    this.createQuestion(modelProvider, question);
    if (options?.changeTopicTitleRequired) {
      if (!this.props.title) {
        this.changeTopicTitle(question.slice(0, 20));
      }
    }
    let answer = '';

    let tokenCount = modelProvider.countToken(this.props.completions);

    const resultStream = await modelProvider.askQuestion(
      this.props.user,
      this.getCurrentCompletion(),
      { previousCompletions: this.getPreviousCompletions() },
    );

    resultStream.on('data', (answerToken) => {
      answer += answerToken;
      tokenCount += 1;
    });

    resultStream.on('end', () => {
      this.reflectAnswerAndTokenCount(answer, tokenCount);
    });
    return resultStream;
  }
  private createQuestion(modelProvider: ModelProvider, question: string): void {
    this.props.completions = this.props.completions || [];
    this.props.completions.push(
      CompletionImpl.createQuestion(modelProvider, question),
    );
  }
  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void {
    if (this.props.completions.length != 0) {
      this.getCurrentCompletion().reflectAnswerAndTokenCount(
        answer,
        tokenCount,
      );
    }
  }
  resumeTopic(completion: Completion) {
    this.props.completions.push(completion);
  }
  addTags(tags: Tag[]): void {
    this.props.tags?.push(...tags);
  }
  deleteTags(tags: Tag[]): void {
    this.props.tags?.forEach((tag) => {
      if (
        tags?.find(
          (tagToRemove) =>
            tagToRemove.getPropsCopy().id == tag.getPropsCopy().id,
        )
      ) {
        tag.delete();
      }
    });
  }

  public syncTagsWithNewTagNames(
    tagNames: string[],
    deleteOtherTags: boolean = false,
  ): void {
    const newTags = tagNames
      .filter(
        (tagName) =>
          !this.props.tags?.find((tag) => tag.getPropsCopy().name == tagName),
      )
      .map((tagName) => TagImpl.create(tagName));
    this.addTags(newTags);

    if (deleteOtherTags) {
      const deletedTags = this.props.tags?.filter(
        (tag) =>
          !tagNames?.find((tagName) => tagName == tag.getPropsCopy().name),
      );
      this.deleteTags(deletedTags);
    }
  }
}
