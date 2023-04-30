import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'old_password',
    description: "The user's current password",
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'new_password',
    description: "The user's new password",
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'user_id',
    description: 'The user ID of the user changing the password',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
