import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTopicTagDto {
  @ApiProperty()
  @IsString()
  topicId: string;

  @ApiProperty()
  @IsString()
  tagName: string;
}
