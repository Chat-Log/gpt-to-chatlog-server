import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
