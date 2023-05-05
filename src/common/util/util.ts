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

const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

const hasObjectItems = (array) => {
  return array.some((item) => typeof item === 'object' && item !== null);
};

export const flattenObjectWithoutProps = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => flattenObjectWithoutProps(item));
  }

  const newObj = {};
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value) && hasObjectItems(value)) {
        newObj[key] = value.map((item) => flattenObjectWithoutProps(item));
      } else if (isPlainObject(value)) {
        Object.assign(newObj, flattenObjectWithoutProps(value));
      } else {
        newObj[key] = value;
      }
    } else if (key === 'props') {
      if (Array.isArray(value)) {
        if (!value) {
          return;
        }
        const flattenedArray = value.map((item) =>
          flattenObjectWithoutProps(item),
        );
        newObj[key] = flattenedArray.flat();
      } else {
        Object.assign(newObj, flattenObjectWithoutProps(value));
      }
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
};
