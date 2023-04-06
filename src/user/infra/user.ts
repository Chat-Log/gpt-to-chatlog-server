import { User } from '../domain/user';

export class UserImpl implements User {
  private email: string;
  private password: string;
  private apiKey: string;

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
}
