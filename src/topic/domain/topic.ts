import { TopicProps } from '../interface/interface';

export interface Topic {
  updateTopicTitle(name: string): void;
  getProps(): TopicProps;
}
