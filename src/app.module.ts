import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import authConfig from './config/auth/auth.config';
import databaseConfig from './config/database/database.config';
import { CustomerModule } from './customer/customer.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { OrderModule } from './order/order.module';
import { PetModule } from './pet/pet.module';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig,authConfig] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.url'),
      }),
    }),
    PetModule,
    CustomerModule,
    ProductModule,
    OrderModule,
    CartModule,
    ServiceModule,
    AuthModule,
    // PetsModule,
    // ProductsModule,
    // CustomersModule,
    // OrdersModule,
    // ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
