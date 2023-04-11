import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from '../domain/completion/completion';
import { Topic } from '../domain/topic';
import { CompletionImpl } from './completion/completion';
import { User } from '../../user/domain/user';
import { v4 as uuid } from 'uuid';
import { Tag } from '../domain/completion/tag/tag';
import { Readable } from 'stream';
import { TopicProps } from '../domain/topic.props';

export class TopicImpl extends Topic {
  private id: string;
  private title: string;
  private tags: Tag[] = [];
  private completions: Completion[] = [];
  private user: User;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: Partial<TopicProps>) {
    super(props);
  }
  updateTopicTitle(title: string): void {
    this.title = title;
  }

  static createTopic(tags: Tag[], user: User): Topic {
    return new TopicImpl({
      tags,
      user,
      id: uuid(),
    });
  }
  private getCurrentCompletion(): Completion {
    return this.completions[this.completions.length - 1];
  }
  private getPreviousCompletions(): Completion[] {
    return this.completions.slice(0, this.completions.length - 1);
  }
  askToModel(modelProvider: ModelProvider, question: string): Readable {
    this.createQuestion(modelProvider, question);
    let answer = '';

    let tokenCount = modelProvider.countToken(this.completions);

    const resultStream = modelProvider.askQuestion(
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
    this.completions.push(
      CompletionImpl.createQuestion(modelProvider, question),
    );
  }
  reflectAnswerAndTokenCount(answer: string, tokenCount: number): void {
    if (this.completions.length != 0) {
      this.getCurrentCompletion().reflectAnswerAndTokenCount(
        answer,
        tokenCount,
      );
    }
  }
  resumeTopic(completion: Completion) {
    this.completions.push(completion);
  }
  addTags(tags: Tag[]): void {
    this.tags.push(...tags);
  }
}
