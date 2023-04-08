import { UserProps } from './user.props';
import { BaseDomainModel } from '../../common/base.domain-model';

export abstract class User extends BaseDomainModel<UserProps> {
  abstract loginByEmail(inputPassword: string): void;

  abstract loginByKakao(): User;

  abstract changeApiKey(): void;

  abstract logout(): void;

  abstract resetPassword(): string;

  abstract changePassword(): boolean;

  abstract findEmail(phone: string): string;
}
