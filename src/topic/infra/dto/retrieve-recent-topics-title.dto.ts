import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RetrieveRecentTopicsTitleDto {
  @ApiProperty({
    description: 'The page size of the result set.',
    required: false,
    default: '10',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  pagesize: string;

  @ApiProperty({
    description: 'The page index of the result set.',
    required: false,
    default: '1',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  pageindex: string;

  @Transform(({ value }) => parseInt(value))
  get pageSize(): number {
    return this.pagesize ? +this.pagesize : 10;
  }

  @Transform(({ value }) => parseInt(value))
  get pageIndex(): number {
    return this.pageindex ? +this.pageindex : 1;
  }
}
