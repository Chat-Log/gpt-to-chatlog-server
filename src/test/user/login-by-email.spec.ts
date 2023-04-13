import { UserService } from '../../user/infra/user.service';
import { UserImpl } from '../../user/infra/user';
import { Test } from '@nestjs/testing';
import { UserOrmRepository } from '../../user/infra/user.orm-repository';
import {
  DataNotFoundException,
  UserNotFoundException,
} from '../../common/exception/data-access.exception';
import { Auth } from '../../common/auth/auth';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserOrmRepository;

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loginByEmail', () => {
    it('should return user and access token if email and password are correct', async () => {
      // Arrange
      const email = 'test@example.com';
      const id = 'test-id';
      const password = 'password';
      const phone = '1234567890';
      const name = 'Test User';
      const user = new UserImpl({ id, email, password, phone, name });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(user, 'loginByEmail').mockResolvedValue();
      jest.spyOn(user, 'getPropsCopy').mockReturnValue({ id });
      jest
        .spyOn(Auth, 'issueAccessToken')
        .mockReturnValue('generated-access-token');

      // Act
      const result = await userService.loginByEmail(email, password);

      // Assert
      expect(result.user).toEqual(user);
      expect(result.accessToken).toEqual('generated-access-token');
      expect(userRepository.findOne).toBeCalledWith({ where: { email } });
      expect(user.loginByEmail).toBeCalledWith(password);
      expect(Auth.issueAccessToken).toBeCalledWith({
        id: user.getPropsCopy().id,
      });
    });

    it('should throw a DataNotFoundException if email is not registered', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(userService.loginByEmail(email, password)).rejects.toThrow(
        DataNotFoundException,
      );
      expect(userRepository.findOne).toBeCalledWith({ where: { email } });
    });

    it('should throw an error if password is incorrect', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'incorrect-password';
      const phone = '1234567890';
      const name = 'Test User';
      const user = new UserImpl({
        email,
        password: 'correct-password',
        phone,
        name,
      });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(user, 'loginByEmail')
        .mockRejectedValue(new UserNotFoundException('user not found'));
      jest.spyOn(user, 'getPropsCopy').mockReturnValue({ id: 'test-id' });
      // Act & Assert
      await expect(userService.loginByEmail(email, password)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findOne).toBeCalledWith({ where: { email } });
      expect(user.loginByEmail).toBeCalledWith(password);
    });
  });
});
