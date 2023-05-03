import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeGptKeyDto {
  @ApiProperty({
    example: 'new-api-key',
    description: 'The new GPT API key for the user',
  })
  @IsString()
  @IsNotEmpty()
  gptKey: string;
}
