import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerSchema } from './schema/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
