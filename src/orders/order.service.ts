// src/orders/orders.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: DatabaseService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Check if each product's quantity in the cart is available in stock
    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Not enough stock for product ${item.product.name}`,
        );
      }
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        orderDate: new Date(),
        status: 'Pending',
        discount: 0, // Assuming no discount for now
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            product: { connect: { productId: item.productId } },
          })),
        },
      },
    });

    // Update stock for each product
    for (const item of cart.cartItems) {
      await this.prisma.product.update({
        where: { productId: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear the user's cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId },
    });

    return order;
  }

  async getOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const { status } = updateOrderStatusDto;

    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status },
    });
  }

  async applyCoupon(applyCouponDto: ApplyCouponDto) {
    const { orderId, couponCode } = applyCouponDto;

    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    const currentDate = new Date();
    if (coupon.expiryDate < currentDate) {
      throw new BadRequestException('Coupon has expired');
    }

    const discount = coupon.discount;

    return this.prisma.order.update({
      where: { orderId },
      data: { discount },
    });
  }
}
