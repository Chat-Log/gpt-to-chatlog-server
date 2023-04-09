import { User } from '../../user/domain/user';
import { UserService } from '../../user/infra/user.service';
import { BaseRepository } from '../../common/base.repository';
import { Test } from '@nestjs/testing';
import { UserOrmRepository } from '../../user/infra/user.orm-repository';
import { UserImpl } from '../../user/infra/user';

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

  describe('resetPassword', () => {
    it('should reset user password if user exists with the given email and phone number', async () => {
      // Arrange
      const email = 'test@example.com';
      const phone = '1234567890';
      const user = new UserImpl({ email, phone });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(user, 'resetPassword').mockResolvedValue('newPassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      // Act
      const result = await userService.resetPassword(email, phone);

      // Assert
      expect(result).toEqual('newPassword');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, phone },
      });
      expect(user.resetPassword).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user does not exist with the given email and phone number', async () => {
      // Arrange
      const email = 'nonExistingEmail@example.com';
      const phone = '1234567890';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.resetPassword(email, phone)).rejects.toThrow();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, phone },
      });
    });
  });
});
