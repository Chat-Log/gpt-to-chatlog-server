import { UserService } from '../../user/infra/user.service';
import { BaseRepository } from '../../common/base.repository';
import { User } from '../../user/domain/user';
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

  describe('changeGptKey', () => {
    it('should change gpt key if user exists with the given user ID', async () => {
      // Arrange
      const userId = 'dummyUserId';
      const gptKey = 'newGptKey';
      const user = new UserImpl({ id: userId, gptKey: 'oldGptKey' });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      // Act
      const result = await userService.changeGptKey(userId, gptKey);
      console.log(user);
      // Assert
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.getPropsCopy().gptKey).toEqual(gptKey);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user does not exist with the given user ID', async () => {
      // Arrange
      const userId = 'nonExistingUserId';
      const gptKey = 'newGptKey';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.changeGptKey(userId, gptKey)).rejects.toThrow();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
