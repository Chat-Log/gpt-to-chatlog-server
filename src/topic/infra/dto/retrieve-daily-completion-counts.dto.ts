// retrieve-daily-completion-counts.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RetrieveDailyCompletionCountsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Year for which completion counts should be retrieved',
    example: '2021',
  })
  @IsString()
  @IsOptional()
  year: string;
}
