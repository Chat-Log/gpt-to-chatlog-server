import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpByEmailDto } from './dto/sign-up-by-email.dto';
import { LoginByEmailDto } from './dto/login-by-email.dto';
import { UserCommonResponseDto } from './dto/user.common-reponse.dto';
import { InvalidInputException } from '../../common/exception/bad-request.exception';
import { ChangeGptKeyDto } from './dto/change-gpt-key.dto';
import { UserGuard } from '../../common/guard/user.guard';

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

  @UseGuards(UserGuard)
  @Patch('/gpt-key')
  async changeApiKey(@Body() dto: ChangeGptKeyDto) {
    const { userId, gptKey } = dto;
    if (!userId) throw new InvalidInputException('no userId');
    const user = await this.userService.changeGptKey(userId, gptKey);
    return new UserCommonResponseDto({ user });
  }
}
