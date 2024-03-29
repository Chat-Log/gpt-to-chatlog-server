import { Injectable } from '@nestjs/common';
import { UserImpl } from './user';
import { UserOrmRepository } from './user.orm-repository';
import {
  DataConflictException,
  DataNotFoundException,
  UserNotFoundException,
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

  public async changeGptKey(userId: string, gptKey: string) {
    const user = await this.findUserByIdOrThrowError(userId);
    user.changeGptKey(gptKey);
    await this.userRepository.save(user);
    return user;
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

  public async findUserByIdOrThrowError(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundException(`not exist user with id : ${userId}`);
    }
    return user;
  }
  public async findEmail(phone: string) {
    const users = await this.userRepository.find({ where: { phone: phone } });
    if (!users) {
      throw new UserNotFoundException(`no exist user with phone : ${phone}`);
    }
    const emails = [];
    for (const user of users) {
      emails.push(user.getPropsCopy().email);
    }

    return emails;
  }

  public async resetPassword(email: string, phone: string) {
    const user = await this.userRepository.findOne({
      where: { email: email, phone: phone },
    });
    if (!user) {
      throw new UserNotFoundException(
        `no exist user with email : ${email} and phone : ${phone}`,
      );
    }
    const newPassword = await user.resetPassword();
    await this.userRepository.save(user);
    return newPassword;
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.findUserByIdOrThrowError(userId);
    await user.changePassword(oldPassword, newPassword);
    await this.userRepository.save(user);
    return user;
  }
}
