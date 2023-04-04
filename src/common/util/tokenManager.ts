import {
  encoding_for_model as encodingForModel,
  get_encoding as getEncoding,
} from '@dqbd/tiktoken';
import { IMessage } from '../interface/interface';

export class TokenManager {
  private gptEncoder: any;
  static getTokenizer(encoding, isModelName = false, extendSpecialTokens = {}) {
    let tokenizer;
    if (isModelName) {
      tokenizer = encodingForModel(encoding, extendSpecialTokens);
    } else {
      tokenizer = getEncoding(encoding, extendSpecialTokens);
    }
    return tokenizer;
  }

  constructor() {
    this.gptEncoder = TokenManager.getTokenizer('cl100k_base');
  }

  getTokenCount(text) {
    return this.gptEncoder.encode(text, 'all').length;
  }

  getTokenCountForMessages(messages: IMessage[]) {
    const messagesTokenCount = messages.map((message): number => {
      const propertyTokenCounts = Object.entries(message).map(
        ([key, value]) => {
          const numTokens = this.getTokenCount(value);
          const adjustment = key === 'name' ? 1 : 0;
          return numTokens - adjustment;
        },
      );
      return propertyTokenCounts.reduce((a, b) => a + b, 4);
    });
    return messagesTokenCount.reduce((a, b) => a + b, 0);
  }
}
