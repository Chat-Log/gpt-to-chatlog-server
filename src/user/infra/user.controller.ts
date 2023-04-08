import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpByEmailDto } from './dto/sign-up-by-email.dto';
import { LoginByEmailDto } from './dto/login-by-email.dto';
import { UserCommonResponseDto } from './dto/user.common-reponse.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up/email')
  async signUpByEmail(@Body() dto: SignUpByEmailDto) {
    const { email, password, phone, name } = dto;
    const user = await this.userService.signUpByEmail(
      email,
      password,
      phone,
      name,
    );
    return new UserCommonResponseDto({ user });
  }

  @Post('/login/email')
  async loginByEmail(@Body() dto: LoginByEmailDto) {
    const { email, password } = dto;
    const { accessToken, user } = await this.userService.loginByEmail(
      email,
      password,
    );
    return new UserCommonResponseDto({
      user,
      data: { accessToken },
    });
  }
}
