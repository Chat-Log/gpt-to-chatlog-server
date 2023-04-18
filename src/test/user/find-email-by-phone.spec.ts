import { UserNotFoundException } from '../../common/exception/data-access.exception';
import { UserService } from '../../user/infra/user.service';
import { Test } from '@nestjs/testing';
import { UserOrmRepository } from '../../user/infra/user.orm-repository';
import { UserImpl } from '../../user/infra/user';

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

  describe('findEmail', () => {
    it('should return the email for the user with the given phone number', async () => {
      // Arrange
      const phone = '1234567890';
      const email = 'test@example.com';
      const user = new UserImpl({ phone, email });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      // Act
      const result = await userService.findEmail(phone);

      // Assert
      expect(result).toBe(email);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { phone } });
    });

    it('should throw an error if no user exists with the given phone number', async () => {
      // Arrange
      const phone = '1234567890';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.findEmail(phone)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { phone } });
    });
  });
});
