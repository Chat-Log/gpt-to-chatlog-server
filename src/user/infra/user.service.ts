import { Injectable } from '@nestjs/common';
import { UserOrmRepository } from './user.orm-repository';
import { UserImpl } from './user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserOrmRepository) {}

  async signUpByEmail(email: string, password: string, phone: string) {
    if (await this.checkDuplicatedEmail(email))
      throw new Error('Duplicated email');

    const user = UserImpl.signUpByEmail(email, password, phone);

    await this.userRepository.save(user);

    return user;
  }

  private checkDuplicatedEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }
}
