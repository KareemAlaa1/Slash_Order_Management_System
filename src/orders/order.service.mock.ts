// order.service.mock.ts

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

export class OrderServiceMock {
  createOrder(createOrderDto: CreateOrderDto) {
    // Mock implementation of createOrder method
    return {
      orderId: 1,
      orderDate: new Date(),
      status: 'Pending',
      userId: createOrderDto.userId,
      orderItems: [],
    };
  }

  getOrderById(orderId: number) {
    // Mock implementation of getOrderById method
    return {
      orderId,
      orderDate: new Date(),
      status: 'Pending',
      orderItems: [],
    };
  }

  updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    // Mock implementation of updateOrderStatus method
    return {
      orderId,
      status: updateOrderStatusDto.status,
    };
  }

  applyCoupon(applyCouponDto: ApplyCouponDto) {
    // Mock implementation of applyCoupon method
    return {
      orderId: applyCouponDto.orderId,
      discountApplied: true,
    };
  }
}
