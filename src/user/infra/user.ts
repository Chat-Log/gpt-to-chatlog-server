import { User } from '../domain/user';
import { UserProps } from '../domain/user.props';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

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
      apiKey: null,
      phone,
      name,
    });
    await user.hashPassword();
    return user;
  }

  loginByEmail(email: string, password: string): User {
    throw new Error('Method not implemented.');
  }

  loginByKakao(): User {
    throw new Error('Method not implemented.');
  }

  changeApiKey(): void {
    throw new Error('Method not implemented.');
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

  findEmail(phone: string): string {
    throw new Error('Method not implemented.');
  }
}
