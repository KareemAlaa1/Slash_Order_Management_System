// order.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderServiceMock } from './order.service.mock'; // Import mock service
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useClass: OrderServiceMock, // Use mock class for OrderService
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        // Add other fields as necessary
      };
      const result = await controller.createOrder(createOrderDto);
      expect(result.orderId).toBeDefined();
      expect(result.status).toBe('Pending');
      expect(result.userId).toBe(createOrderDto.userId);
    });
  });

  describe('getOrderById', () => {
    it('should return order details by order ID', async () => {
      const orderId = 1;
      const result = await controller.getOrderById(orderId);
      expect(result.orderId).toBe(orderId);
      expect(result.status).toBe('Pending');
    });

    it('should throw NotFoundException for non-existing order', async () => {
      const orderId = 999; // Non-existing order ID
      jest.spyOn(orderService, 'getOrderById').mockImplementationOnce(() => {
        throw new NotFoundException('Order not found');
      });

      await expect(controller.getOrderById(orderId)).rejects.toThrow(
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
      const result = await controller.updateOrderStatus(
        orderId,
        updateOrderStatusDto,
      );
      expect(result.orderId).toBe(orderId);
      expect(result.status).toBe(updateOrderStatusDto.status);
    });
  });

  describe('applyCoupon', () => {
    it('should apply a coupon to an order', async () => {
      const applyCouponDto: ApplyCouponDto = {
        orderId: 1,
        couponCode: 'DISCOUNT10',
      };
      const result = await controller.applyCoupon(applyCouponDto);
      expect(result.orderId).toBe(applyCouponDto.orderId);
    });
  });
});
