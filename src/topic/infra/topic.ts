import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from '../domain/completion/completion';
import { Topic } from '../domain/topic';
import { TopicProps } from '../interface/interface';
import { CompletionImpl } from './completion/completion';
import { User } from '../../user/domain/user';
import { v4 as uuid } from 'uuid';
import { Tag } from '../domain/completion/tag/tag';
import { Readable } from 'stream';
export class TopicImpl implements Topic {
  private id: string;
  private title: string;
  private tags: Tag[];
  private completions: Completion[] = [];
  private user: User;
  private createdAt: Date;
  private updatedAt: Date;

  updateTopicTitle(title: string): void {
    this.title = title;
  }

  static createTopic(tags: Tag[], user: User): Topic {
    const newTopic = new TopicImpl();
    newTopic.tags = tags;
    newTopic.id = uuid();
    newTopic.user = user;

    return newTopic;
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

  getProps(): TopicProps {
    return {
      id: this.id,
      title: this.title,
      completions: this.completions,
      tags: this.tags.map((tag) => tag.getProps()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
