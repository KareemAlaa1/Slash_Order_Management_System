import { PrismaClient } from '@prisma/client';

export class DatabaseServiceMock {
  prisma = new PrismaClient();

  cart = {
    findUnique: jest.fn(),
  };

  order = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  product = {
    update: jest.fn(),
  };

  cartItem = {
    deleteMany: jest.fn(),
  };

  coupon = {
    findUnique: jest.fn(),
  };

  async productFindUnique(productId: number) {
    return this.prisma.product.findUnique({
      where: { productId },
    });
  }

  async cartFindUnique(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }

  async cartItemUpdate(cartItemId: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: { cartItemId },
      data: { quantity },
    });
  }

  async cartItemCreate(cartId: number, productId: number, quantity: number) {
    return this.prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  }

  async cartCreate(userId: number) {
    return this.prisma.cart.create({
      data: { userId },
    });
  }

  async cartItemDelete(cartItemId: number) {
    return this.prisma.cartItem.delete({
      where: { cartItemId },
    });
  }
}
