// src/cart/cart.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: DatabaseService) {}

  async addToCart(createCartItemDto: CreateCartItemDto) {
    const { userId, productId, quantity } = createCartItemDto;

    const product = await this.prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (cart) {
      const cartItem = cart.cartItems.find(
        (item) => item.productId === productId,
      );
      if (cartItem) {
        await this.prisma.cartItem.update({
          where: { cartItemId: cartItem.cartItemId },
          data: { quantity: cartItem.quantity + quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.cartId,
            productId,
            quantity,
          },
        });
      }
    } else {
      const newCart = await this.prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
      return newCart;
    }

    return { message: 'Product added to cart' };
  }

  async getCart(userId: number) {
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

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    return cart;
  }

  async updateCartItem(updateCartItemDto: UpdateCartItemDto) {
    const { userId, productId, quantity } = updateCartItemDto;

    const product = await this.prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem) {
      throw new BadRequestException('Product not found in cart');
    }

    await this.prisma.cartItem.update({
      where: { cartItemId: cartItem.cartItemId },
      data: { quantity },
    });

    return { message: 'Cart updated successfully' };
  }

  async removeFromCart(removeCartItemDto: RemoveCartItemDto) {
    const { userId, productId } = removeCartItemDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem) {
      throw new BadRequestException('Product not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { cartItemId: cartItem.cartItemId },
    });

    return { message: 'Product removed from cart' };
  }
}
