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

export class SearchCompletionsDto {
  @IsArray()
  @IsOptional()
  modelnames: ModelName[];

  @IsArray()
  @IsOptional()
  tagnames: string[];

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsEnum(SearchType)
  @IsOptional()
  searchtype: SearchType;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  onlylastcompletions: boolean;

  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsOptional()
  pageindex: string;

  @IsString()
  @IsOptional()
  pagesize: string;
}
