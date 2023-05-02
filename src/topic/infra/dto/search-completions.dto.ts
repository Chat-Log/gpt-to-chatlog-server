import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModelName, SearchType } from '../../../common/enum/enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCompletionsDto {
  @ApiProperty({
    type: 'enum',
    enum: ModelName,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  modelnames: ModelName[];

  @ApiProperty({
    type: [String],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  tagnames: string[];

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
    example: '2021-01-01',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty({ type: String, enum: SearchType, required: false })
  @IsEnum(SearchType)
  @IsOptional()
  searchtype: SearchType;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  onlylastcompletions: boolean;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  query: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  pageindex: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  pagesize: string;
}
