import { Completion } from '../domain/completion/completion';
import { Topic } from '../domain/topic';

export class TopicImpl implements Topic {
  private name: string;
  private completions: Completion[];

  static createTopic(name: string, completions: Completion[]): Topic {
    const newTopic = new TopicImpl();
    newTopic.completions = completions;
    newTopic.name = name;
    return newTopic;
  }
  updateTopicTitle(name: string): void {
    this.name = name;
  }
}
