import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

export class CartServiceMock {
  addToCart = jest.fn(
    (createCartItemDto: CreateCartItemDto) => createCartItemDto,
  );
  getCart = jest.fn((userId: number) => ({ userId, items: [] }));
  updateCartItem = jest.fn(
    (updateCartItemDto: UpdateCartItemDto) => updateCartItemDto,
  );
  removeFromCart = jest.fn(
    (removeCartItemDto: RemoveCartItemDto) => removeCartItemDto,
  );
}
