import { UserProps } from '../interface/interface';

export interface User {
  loginByEmail(email: string, password: string): User;

  loginByKakao(): User;

  changeApiKey(): void;

  logout(): void;

  resetPassword(): string;

  changePassword(): boolean;

  findEmail(phone: string): string;

  getProps(): UserProps;
}
