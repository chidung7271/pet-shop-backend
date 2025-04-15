import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSchema } from './schema/service.schema';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports:[
      MongooseModule.forFeature([
            { name: 'Service', schema: ServiceSchema },
          ]),
    ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
