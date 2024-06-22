// user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock'; // Import mock service
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useClass: DatabaseServiceMock, // Use mock class for DatabaseService
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderHistory', () => {
    it('should return order history for a valid user', async () => {
      const userId = 1;
      const mockOrderData = [
        {
          orderId: 1,
          orderItems: [
            {
              productId: 1,
              quantity: 2,
              product: { productId: 1, name: 'Product A' },
            },
            {
              productId: 2,
              quantity: 1,
              product: { productId: 2, name: 'Product B' },
            },
          ],
        },
        {
          orderId: 2,
          orderItems: [
            {
              productId: 3,
              quantity: 3,
              product: { productId: 3, name: 'Product C' },
            },
          ],
        },
      ];

      const result = await service.getOrderHistory(userId);

      expect(result).toHaveLength(2); // Assuming mock data has 2 orders
      expect(result[0].orderId).toBe(1);
      expect(result[0].orderItems).toHaveLength(2);
      expect(result[0].orderItems[0].product.name).toBe('Product A');
    });

    it('should throw NotFoundException for non-existing user', async () => {
      const userId = 999; // Non-existing user ID
      jest.spyOn(databaseService.order, 'findMany').mockResolvedValue([]);

      await expect(service.getOrderHistory(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
