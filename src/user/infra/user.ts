import { User } from '../domain/user';
import { UserProps } from '../interface/interface';

export class UserImpl implements User {
  private id: string;
  private email: string;
  private password: string;
  private apiKey: string;
  private phone: string;
  private name: string;
  private createdAt: Date;
  private updatedAt: Date;

  static signUpByEmail(
    email: string,
    password: string,
    phone: string,
  ): UserImpl {
    return new UserImpl();
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
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      apiKey: this.apiKey,
    };
  }
}
