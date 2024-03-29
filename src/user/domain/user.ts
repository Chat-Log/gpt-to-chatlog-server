import { UserProps } from './user.props';
import { BaseDomainModel } from '../../common/base.domain-model';

export abstract class User extends BaseDomainModel<UserProps> {
  abstract loginByEmail(inputPassword: string): void;

  abstract changeGptKey(gptKey: string): void;

  abstract logout(): void;

  abstract resetPassword(): Promise<string>;

  abstract changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void>;
}
