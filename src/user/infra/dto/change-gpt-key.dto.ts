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

  @ApiProperty({
    example: 'user-id',
    description: 'The ID of the user whose GPT API key will be updated',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
