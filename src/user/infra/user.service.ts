import { Injectable } from '@nestjs/common';
import { UserImpl } from './user';
import { UserOrmRepository } from './user.orm-repository';
import {
  DataConflictException,
  DataNotFoundException,
} from '../../common/exception/data-access.exception';
import { User } from '../domain/user';
import { Auth } from '../../common/auth/auth';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserOrmRepository) {}

  async signUpByEmail(
    email: string,
    password: string,
    phone: string,
    name: string,
  ) {
    await this.checkDuplicatedEmail(email);
    const user = await UserImpl.signUpByEmail(email, password, phone, name);
    await this.userRepository.save(user);
    return user;
  }

  async loginByEmail(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new DataNotFoundException('not exist email');
    }
    await user.loginByEmail(password);
    const accessToken = Auth.issueAccessToken({ id: user.getPropsCopy().id });
    return { user, accessToken };
  }

  private async checkDuplicatedEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new DataConflictException('already exist email');
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }
}
