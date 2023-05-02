import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpByEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: '01012341234',
    description: 'The phone number of the user',
    format: 'phone',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString()
  name: string;
}
