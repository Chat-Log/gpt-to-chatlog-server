import { IsString } from 'class-validator';

export class ChangeTopicTitleDto {
  @IsString()
  title: string;
}
