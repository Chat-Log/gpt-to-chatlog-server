import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindEmailByPhoneDto {
  @ApiProperty({
    example: '01012341234',
    description: 'The phone number to search for',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
