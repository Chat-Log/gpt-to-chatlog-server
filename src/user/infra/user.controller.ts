import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpByEmailDto } from './dto/sign-up-by-email.dto';
import { LoginByEmailDto } from './dto/login-by-email.dto';
import { UserCommonResponseDto } from './dto/user.common-reponse.dto';
import { ChangeGptKeyDto } from './dto/change-gpt-key.dto';
import { UserGuard } from '../../common/guard/user.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth } from '../../common/auth/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindEmailByPhoneDto } from './dto/find-email-by-phone.dto';

@ApiTags('User')
@ApiBearerAuth()
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
    return new UserCommonResponseDto().toResponse({ user });
  }

  @Post('/login/email')
  async loginByEmail(@Body() dto: LoginByEmailDto) {
    const { email, password } = dto;
    const { accessToken, user } = await this.userService.loginByEmail(
      email,
      password,
    );
    return new UserCommonResponseDto().toResponse({
      user,
      accessToken,
    });
  }

  @UseGuards(UserGuard)
  @Patch('/gpt-key')
  async changeApiKey(@Req() request, @Body() dto: ChangeGptKeyDto) {
    const { userId, gptKey } = dto;
    Auth.checkSameUserWithToken(request, userId);
    const user = await this.userService.changeGptKey(userId, gptKey);
    return new UserCommonResponseDto().toResponse({ user });
  }

  @Get('/email')
  async findEmailByPhone(@Query() dto: FindEmailByPhoneDto) {
    const { phone } = dto;
    const email = await this.userService.findEmail(phone);
    return new UserCommonResponseDto().toResponse({ email });
  }

  @Patch('/password/reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const { email, phone } = dto;
    const password = await this.userService.resetPassword(email, phone);
    return new UserCommonResponseDto().toResponse({ password });
  }
  @Patch('/password')
  async changePassword(@Req() request, @Body() dto: ChangePasswordDto) {
    const { userId, oldPassword, newPassword } = dto;
    Auth.checkSameUserWithToken(request, userId);
    const user = await this.userService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    return new UserCommonResponseDto().toResponse({ user });
  }
}
