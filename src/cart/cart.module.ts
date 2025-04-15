import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartSchema } from './schema/cart.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
          { name: 'Customer', schema: CartSchema },
        ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
