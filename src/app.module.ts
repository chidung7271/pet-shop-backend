import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import databaseConfig from './config/database/database.config';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { PetModule } from './pet/pet.module';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),
    PetModule,
    CustomerModule,
    ProductModule,
    OrderModule,
    CartModule,
    ServiceModule,
    // PetsModule,
    // ProductsModule,
    // CustomersModule,
    // OrdersModule,
    // ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
