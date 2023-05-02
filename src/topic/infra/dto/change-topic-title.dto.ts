import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeTopicTitleDto {
  @IsString()
  @ApiProperty({ example: 'My New Topic Title' })
  title: string;
}
