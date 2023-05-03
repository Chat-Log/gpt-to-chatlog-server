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

export const flattenObjectWithoutProps = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        newObj[key] = value.map((item) => flattenObjectWithoutProps(item));
      } else {
        Object.assign(newObj, flattenObjectWithoutProps(value));
      }
    } else if (key === 'props') {
      Object.assign(newObj, flattenObjectWithoutProps(value));
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
};
