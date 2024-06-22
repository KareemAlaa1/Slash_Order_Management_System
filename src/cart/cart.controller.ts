import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addToCart(createCartItemDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Put('update')
  async updateCartItem(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(updateCartItemDto);
  }

  @Delete('remove')
  async removeFromCart(@Body() removeCartItemDto: RemoveCartItemDto) {
    return this.cartService.removeFromCart(removeCartItemDto);
  }
}
