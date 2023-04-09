import { IsString } from 'class-validator';

export class SignUpByEmailDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;
}
