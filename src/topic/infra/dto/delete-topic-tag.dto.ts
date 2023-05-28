import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteTopicTagDto {
  @ApiProperty()
  @IsString()
  topicId: string;

  @ApiProperty()
  @IsString()
  tagName: string;
}
