import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpByEmailDto } from './dto/sign-up-by-email.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUpByEmail(@Body() dto: SignUpByEmailDto) {
    const { email, password, phone } = dto;
    return await this.userService.signUpByEmail(email, password, phone);
  }
}
