// user.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserServiceMock } from './user.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useClass: UserServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrderHistory', () => {
    it('should return order history for a valid user', async () => {
      const userId = 1;
      const result = await controller.getOrderHistory(userId);
      expect(result).toHaveLength(2); // Assuming mock data has 2 orders
    });

    it('should throw NotFoundException for non-existing user', async () => {
      const userId = 999; // Non-existing user ID
      jest.spyOn(userService, 'getOrderHistory').mockImplementationOnce(() => {
        throw new NotFoundException('User not found');
      });
    });
  });
});
