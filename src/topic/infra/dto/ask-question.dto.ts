import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
    description: 'topic title, optional',
    example: 'topictitle',
  })
  @IsOptional()
  @IsString()
  topicTitle: string;

  @ApiProperty({
    description: '[deprecated] this property will be deleted.',
    example: ['111', '222'],
  })
  @IsOptional()
  @IsArray()
  prevCompletionIds: string[];

  @ApiProperty({
    description: 'completion count to refer when asking question. default is 5',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  completionReferCount: number;
}
