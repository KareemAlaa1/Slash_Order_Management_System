import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'; // Import Swagger decorators
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get(':userId/orders')
  async getOrderHistory(@Param('userId') userId: number) {
    return this.usersService.getOrderHistory(userId);
  }
}
