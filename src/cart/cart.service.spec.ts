// cart.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let databaseService: DatabaseServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: DatabaseServiceMock,
          useClass: DatabaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    databaseService = module.get<DatabaseServiceMock>(DatabaseServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add a product to the cart', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };

      const result = await service.addToCart(createCartItemDto);

      expect(result).toEqual({ message: 'Product added to cart' });
    });

    it('should update the quantity if product already in cart', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };

      const productFindUniqueSpy = jest.spyOn(
        databaseService,
        'productFindUnique',
      );

      const cartFindUniqueSpy = jest.spyOn(databaseService, 'cartFindUnique');

      const cartItemUpdateSpy = jest.spyOn(databaseService, 'cartItemUpdate');

      const result = await service.addToCart(createCartItemDto);

      expect(result).toEqual({ message: 'Product added to cart' });
      expect(productFindUniqueSpy).toHaveBeenCalledWith(1);
      expect(cartFindUniqueSpy).toHaveBeenCalledWith(1);
      expect(cartItemUpdateSpy).toHaveBeenCalledWith(1, 3);
    });

    it('should throw BadRequestException if product not found', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };

      jest
        .spyOn(databaseService, 'productFindUnique')
        .mockResolvedValueOnce(null);

      await expect(service.addToCart(createCartItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if not enough stock available', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 10,
      };

      jest.spyOn(databaseService, 'productFindUnique');

      await expect(service.addToCart(createCartItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCart', () => {
    it("should retrieve the user's cart", async () => {
      const userId = 1;

      const cartFindUniqueSpy = jest.spyOn(databaseService, 'cartFindUnique');

      const result = await service.getCart(userId);

      expect(result.userId).toBe(userId);
      expect(result.cartItems.length).toBe(1);
      expect(cartFindUniqueSpy).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if cart not found', async () => {
      const userId = 1;

      jest.spyOn(databaseService, 'cartFindUnique').mockResolvedValueOnce(null);

      await expect(service.getCart(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
