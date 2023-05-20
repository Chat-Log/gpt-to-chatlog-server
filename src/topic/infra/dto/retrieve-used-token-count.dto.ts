import { ModelName } from '../../../common/enum/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RetrieveUsedTokenCountDto {
  @ApiProperty({
    type: 'enum',
    enum: ModelName,
    isArray: true,
    required: false,
    description: ' if modelName is not given, all models will be counted.',
  })
  @IsArray()
  @IsOptional()
  modelnames: ModelName[];

  @ApiProperty({
    type: 'string',
    required: true,
    example: '2021',
  })
  year: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '12',
  })
  month: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    example: 'false',
  })
  @IsBoolean()
  @Transform(({ value }) => {
    return value === 'true';
  })
  groupByEachModel: boolean;
}
