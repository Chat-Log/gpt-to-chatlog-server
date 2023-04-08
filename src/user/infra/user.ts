import { User } from '../domain/user';
import { UserProps } from '../domain/user.props';
import { v4 as uuid } from 'uuid';
import { UserNotFoundException } from '../../common/exception/data-access.exception';
import * as bcrypt from 'bcrypt';

export class UserImpl extends User {
  constructor(props: Partial<UserProps>) {
    super(props);
  }

  static async signUpByEmail(
    email: string,
    password: string,
    phone: string,
    name: string,
  ): Promise<UserImpl> {
    const user = new UserImpl({
      id: uuid(),
      email,
      password,
      gptKey: null,
      phone,
      name,
    });
    await user.hashPassword();
    return user;
  }

  async loginByEmail(inputPassword: string): Promise<void> {
    if (!(await this.comparePassword(inputPassword))) {
      throw new UserNotFoundException('wrong password');
    }
  }

  changeGptKey(gptKey: string): void {
    this.props.gptKey = gptKey;
  }

  async hashPassword(): Promise<void> {
    this.props.password = await bcrypt.hash(this.props.password, 10);
  }

  logout(): void {
    throw new Error('Method not implemented.');
  }

  resetPassword(): string {
    throw new Error('Method not implemented.');
  }

  changePassword(): boolean {
    throw new Error('Method not implemented.');
  }

  private comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.props.password);
  }
}
