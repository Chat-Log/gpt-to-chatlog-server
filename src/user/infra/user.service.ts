import { ConflictException, Injectable } from '@nestjs/common';
import { UserImpl } from './user';
import { UserOrmRepository } from './user.orm-repository';

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

  private async checkDuplicatedEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new ConflictException('Duplicated email');
    }
  }
}
