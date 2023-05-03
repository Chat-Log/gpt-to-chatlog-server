import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModelName } from '../../../common/enum/enum';

import { ApiProperty } from '@nestjs/swagger';

export class AskQuestionDto {
  @ApiProperty({
    description: 'Name of the question and answer model',
    enum: ModelName,
  })
  @IsEnum(ModelName)
  @IsNotEmpty()
  modelName: ModelName;

  @ApiProperty({
    description: 'The text of the question',
    example: 'How do I use NestJS?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Array of tag names associated with the question',
    example: ['nestjs', 'javascript'],
  })
  @IsNotEmpty()
  @IsArray()
  tagNames: string[];

  @ApiProperty({
    description: 'ID of the topic associated with the question (optional)',
    example: '987654321',
  })
  @IsOptional()
  @IsString()
  topicId: string;

  @ApiProperty({
    description: 'Array of IDs of previous question-answer pairs (optional)',
    example: ['111', '222'],
  })
  @IsOptional()
  @IsArray()
  prevCompletionIds: string[];
}
