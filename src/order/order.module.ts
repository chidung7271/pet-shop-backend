import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';
import { CartSchema } from '../cart/schema/cart.schema';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductModule } from '../product/product.module';
import { ProductSchema } from '../product/schema/product.schema';
import { ServiceSchema } from '../service/schema/service.schema';
import { ServiceModule } from '../service/service.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schema/order.schema';
import { SmartOrderService } from './smart-order.service';

@Module({
  imports:[
      MongooseModule.forFeature([
            { name: 'Order', schema: OrderSchema },
            { name: 'Product', schema: ProductSchema },
            { name: 'Service', schema: ServiceSchema },
            { name: 'Cart', schema: CartSchema },
          ]),
      ProductModule,
      ServiceModule,
      CartModule,
      InventoryModule,
    ],
  controllers: [OrderController],
  providers: [OrderService, SmartOrderService],
  exports: [OrderService],
})
export class OrderModule {}
