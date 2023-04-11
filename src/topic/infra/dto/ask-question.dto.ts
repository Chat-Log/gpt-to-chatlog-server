import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModelName } from '../../../common/enum/enum';

export class AskQuestionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ModelName)
  @IsNotEmpty()
  modelName: ModelName;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsArray()
  tagNames: string[];

  @IsOptional()
  @IsString()
  topicId: string;

  @IsOptional()
  @IsArray()
  prevCompletionIds: string[];
}
