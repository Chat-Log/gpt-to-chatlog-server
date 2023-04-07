import { User } from '../domain/user';
import { UserProps } from '../interface/interface';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class UserImpl implements User {
  private id: string;
  private email: string;
  private password: string;
  private apiKey: string;
  private phone: string;
  private name: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: Partial<UserProps>) {
    Object.assign(this, props);
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
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
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

  getProps(): UserProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      apiKey: this.apiKey,
    };
  }
}
