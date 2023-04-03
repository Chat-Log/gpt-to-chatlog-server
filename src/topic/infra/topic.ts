import { ModelProvider } from 'src/model-provider/model-provider';
import { Completion } from '../domain/completion/completion';
import { Topic } from '../domain/topic';
import { TopicProps } from '../interface/interface';
import { CompletionImpl } from './completion/completion';

export class TopicImpl implements Topic {
  private id: number;
  private name: string;
  private completions: Completion[] = [];

  static createTopicForFirstCompletion(
    topicName: string,
    completion: Completion,
  ): Topic {
    const newTopic = new TopicImpl();
    newTopic.id = 10;
    newTopic.name = '반가워요';

    // const newCompletion = CompletionImpl.createCompletion(
    //   model,
    //   question,
    //   prevCompletions,
    // );
    // newCompletion.askQuestion();

    // newTopic.name = name;
    return newTopic;
  }
  updateTopicTitle(name: string): void {
    this.name = name;
  }

  getProps(): TopicProps {
    return {
      id: this.id,
      name: this.name,
      completions: this.completions,
    };
  }

  answerQuestion(completion: Completion): void {
    this.completions.push(completion);
  }
}
