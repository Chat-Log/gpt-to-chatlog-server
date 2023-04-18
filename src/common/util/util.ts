import { ModelName } from '../enum/enum';
import { ModelProvider } from '../../model-provider/model-provider';
import { ChatGPTModel } from '../../ai-models/chat-gpt-model';
import { MockModel } from '../../model-provider/mock-model';

export const chooseModel = (model: ModelName): ModelProvider => {
  switch (model) {
    case ModelName['GPT3.5_TURBO']:
      return new ChatGPTModel();
    case ModelName['MOCK']:
      return new MockModel();
    default:
      return new ChatGPTModel();
  }
};
