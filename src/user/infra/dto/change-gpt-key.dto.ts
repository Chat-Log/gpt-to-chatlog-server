import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeGptKeyDto {
  @IsString()
  @IsNotEmpty()
  gptKey: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
