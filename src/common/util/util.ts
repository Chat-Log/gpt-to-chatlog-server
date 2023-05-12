import { ModelName } from '../enum/enum';
import { ModelProvider } from '../../model-provider/model-provider';
import { ChatGPTModel } from '../../ai-models/chat-gpt-model';
import { MockModel } from '../../model-provider/mock-model';
import { AlpacaModel } from '../../ai-models/alpaca-model';

export const chooseModel = (model: ModelName): ModelProvider => {
  switch (model) {
    case ModelName['GPT3.5_TURBO']:
      return new ChatGPTModel();
    case ModelName['MOCK']:
      return new MockModel();
    case ModelName['ALPACA']:
      return new AlpacaModel();
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
  if (typeof input == 'string') {
    return input;
  }
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value) && hasObjectItems(value)) {
        newObj[key] = value.map((item) => flattenObjectWithoutProps(item));
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
  // console.log(newObj);
  return newObj;
};
