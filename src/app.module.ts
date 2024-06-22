import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { DatabaseModule } from './database/database.module';
import { OrderModule } from './orders/order.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UserModule, DatabaseModule, OrderModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
