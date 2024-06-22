// order.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock'; // Import mock service
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: DatabaseService,
          useClass: DatabaseServiceMock, // Use mock class for DatabaseService
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        // Add other fields as necessary
      };

      const mockCart = {
        cartId: 1,
        userId: createOrderDto.userId,
        cartItems: [
          { productId: 1, quantity: 2, product: { productId: 1, stock: 5 } },
          { productId: 2, quantity: 1, product: { productId: 2, stock: 3 } },
        ],
      };

      (databaseService.cart.findUnique as jest.Mock).mockResolvedValue(
        mockCart,
      );
      (databaseService.order.create as jest.Mock).mockResolvedValue({
        orderId: 1,
      });

      const result = await service.createOrder(createOrderDto);

      expect(result.orderId).toBeDefined();
      expect(result.status).toBe('Pending');
      expect(databaseService.cartItem.deleteMany).toBeCalledWith({
        where: { cartId: mockCart.cartId },
      });
      expect(databaseService.product.update).toHaveBeenCalledTimes(2);
      expect(databaseService.product.update).toHaveBeenCalledWith({
        where: { productId: 1 },
        data: { stock: { decrement: 2 } },
      });
    });

    it('should throw BadRequestException if cart is empty', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
      };

      (databaseService.cart.findUnique as jest.Mock).mockResolvedValue({
        cartId: 1,
        cartItems: [],
      });

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if product stock is insufficient', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
      };

      const mockCart = {
        cartId: 1,
        cartItems: [
          { productId: 1, quantity: 10, product: { productId: 1, stock: 5 } },
        ],
      };

      (databaseService.cart.findUnique as jest.Mock).mockResolvedValue(
        mockCart,
      );

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOrderById', () => {
    it('should return order details by order ID', async () => {
      const orderId = 1;
      const mockOrder = { orderId, status: 'Pending' };
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(
        mockOrder,
      );

      const result = await service.getOrderById(orderId);

      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException for non-existing order', async () => {
      const orderId = 999; // Non-existing order ID
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getOrderById(orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the status of an order', async () => {
      const orderId = 1;
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: 'Shipped',
      };

      const mockOrder = { orderId, status: 'Pending' };
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(
        mockOrder,
      );
      (databaseService.order.update as jest.Mock).mockResolvedValue({
        orderId,
        status: updateOrderStatusDto.status,
      });

      const result = await service.updateOrderStatus(
        orderId,
        updateOrderStatusDto,
      );

      expect(result.orderId).toBe(orderId);
      expect(result.status).toBe(updateOrderStatusDto.status);
    });

    it('should throw NotFoundException for non-existing order', async () => {
      const orderId = 999; // Non-existing order ID
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateOrderStatus(orderId, { status: 'Shipped' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('applyCoupon', () => {
    it('should apply a coupon to an order', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'DISCOUNT10',
      };

      const mockOrder = { orderId: applyCouponDto.orderId };
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(
        mockOrder,
      );
      (databaseService.coupon.findUnique as jest.Mock).mockResolvedValue({
        discount: 0.1,
        expiryDate: new Date(),
      });

      const result = await service.applyCoupon(applyCouponDto);

      expect(result.orderId).toBe(applyCouponDto.orderId);
      expect(result.discount).toBe(0.1);
    });

    it('should throw NotFoundException for non-existing order', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 999, // Non-existing order ID
        couponCode: 'DISCOUNT10',
      };

      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.applyCoupon(applyCouponDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid coupon code', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'INVALIDCODE',
      };

      const mockOrder = { orderId: applyCouponDto.orderId };
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(
        mockOrder,
      );
      (databaseService.coupon.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.applyCoupon(applyCouponDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for expired coupon', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'EXPIREDCODE',
      };

      const mockOrder = { orderId: applyCouponDto.orderId };
      (databaseService.order.findUnique as jest.Mock).mockResolvedValue(
        mockOrder,
      );
      (databaseService.coupon.findUnique as jest.Mock).mockResolvedValue({
        discount: 0.1,
        expiryDate: new Date(2022, 5, 1),
      });

      await expect(service.applyCoupon(applyCouponDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
