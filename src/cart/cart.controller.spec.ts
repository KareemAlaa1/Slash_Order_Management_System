// cart.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartServiceMock } from './cart.service.mock'; // Import mock service
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { BadRequestException } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useClass: CartServiceMock, // Use mock class for CartService
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add an item to the cart', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };

      const result = await controller.addToCart(createCartItemDto);

      expect(result).toEqual(createCartItemDto);
      expect(cartService.addToCart).toHaveBeenCalledWith(createCartItemDto);
    });
  });

  describe('getCart', () => {
    it("should retrieve the user's cart", async () => {
      const userId = 1;

      const result = await controller.getCart(userId);

      expect(result.userId).toBe(userId);
      expect(result.cartItems).toEqual([]);
      expect(cartService.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateCartItem', () => {
    it('should update an item in the cart', async () => {
      const updateCartItemDto: UpdateCartItemDto = {
        userId: 1,
        productId: 1,
        quantity: 3,
      };

      const result = await controller.updateCartItem(updateCartItemDto);

      expect(result).toEqual(updateCartItemDto);
      expect(cartService.updateCartItem).toHaveBeenCalledWith(
        updateCartItemDto,
      );
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', async () => {
      const removeCartItemDto: RemoveCartItemDto = {
        userId: 1,
        productId: 1,
      };

      const result = await controller.removeFromCart(removeCartItemDto);

      expect(result).toEqual(removeCartItemDto);
      expect(cartService.removeFromCart).toHaveBeenCalledWith(
        removeCartItemDto,
      );
    });
  });
});
