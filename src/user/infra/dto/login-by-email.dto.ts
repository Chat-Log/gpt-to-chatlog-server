import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginByEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
