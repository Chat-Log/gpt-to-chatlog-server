import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpByEmailDto } from './dto/sign-up-by-email.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up/email')
  async signUpByEmail(@Body() dto: SignUpByEmailDto) {
    const { email, password, phone, name } = dto;
    return await this.userService.signUpByEmail(email, password, phone, name);
  }
}
