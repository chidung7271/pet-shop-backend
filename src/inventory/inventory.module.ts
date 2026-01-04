import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../product/schema/product.schema';
import { ServiceSchema } from '../service/schema/service.schema';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryTransactionSchema } from './schema/inventory-transaction.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'InventoryTransaction', schema: InventoryTransactionSchema },
            { name: 'Product', schema: ProductSchema },
            { name: 'Service', schema: ServiceSchema },
        ]),
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule {}
