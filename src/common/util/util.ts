import { ModelName } from '../enum/enum';
import { ModelProvider } from '../../model-provider/model-provider';
import { ChatGPTModel } from '../../ai-models/chat-gpt-model';

export const chooseModel = (model: ModelName): ModelProvider => {
  switch (model) {
    case ModelName['GPT3.5_TURBO']:
      return new ChatGPTModel();
    default:
      return new ChatGPTModel();
  }
};
