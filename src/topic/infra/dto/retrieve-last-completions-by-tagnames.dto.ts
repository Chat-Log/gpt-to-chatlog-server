import { IsArray, IsOptional, IsString } from 'class-validator';

export class RetrieveLastCompletionsByTagnamesDto {
  @IsArray()
  @IsOptional()
  tagnames: string[];

  @IsString()
  @IsOptional()
  pageindex: string;

  @IsString()
  @IsOptional()
  pagesize: string;
}
