// src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
  }

  @Post('apply-coupon')
  async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.ordersService.applyCoupon(applyCouponDto);
  }
}
