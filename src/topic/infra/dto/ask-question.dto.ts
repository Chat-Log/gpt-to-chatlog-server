import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Model } from 'src/common/enum/enum';

export class AskQuestionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Model)
  @IsNotEmpty()
  model: Model;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  topicId: string;

  @IsOptional()
  @IsArray()
  prevCompletionIds: string[];
}
