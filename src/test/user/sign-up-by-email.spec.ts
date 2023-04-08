import { UserService } from '../../user/infra/user.service';
import { UserImpl } from '../../user/infra/user';
import { BaseRepository } from '../../common/base.repository';
import { User } from '../../user/domain/user';
import { Test } from '@nestjs/testing';
import { UserOrmRepository } from '../../user/infra/user.orm-repository';
import { DataConflictException } from '../../common/exception/data-access.exception';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: BaseRepository<User, UserEntity>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserOrmRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserOrmRepository>(UserOrmRepository);
  });

  describe('signUpByEmail', () => {
    it('should create a new user if email is not registered', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const phone = '1234567890';
      const name = 'Test User';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const expectedUser = { email, password, phone, name };
      UserImpl.signUpByEmail = jest.fn().mockResolvedValue(expectedUser);
      userRepository.save = jest.fn().mockResolvedValue(expectedUser);

      // Act
      const result = await userService.signUpByEmail(
        email,
        password,
        phone,
        name,
      );

      // Assert
      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toBeCalledWith({ where: { email } });
      expect(UserImpl.signUpByEmail).toBeCalledWith(
        email,
        password,
        phone,
        name,
      );
      expect(userRepository.save).toBeCalledWith(expectedUser);
    });

    it('should throw a ConflictException if email is already registered', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const phone = '1234567890';
      const name = 'Test User';

      const existingUser = { email, password, phone, name };

      userRepository.findOne = jest.fn().mockResolvedValue(existingUser);

      // Act & Assert
      await expect(
        userService.signUpByEmail(email, password, phone, name),
      ).rejects.toThrow(DataConflictException);
      expect(userRepository.findOne).toBeCalledWith({ where: { email } });
    });
  });
});
