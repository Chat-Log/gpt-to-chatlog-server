import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the user account',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '01012341234',
    description: 'The phone number associated with the user account',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
