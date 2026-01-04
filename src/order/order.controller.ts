import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { SmartOrderService } from './smart-order.service';
import { SmartOrderDto, SmartOrderResponseDto } from './dto/smart-order.dto';

@Controller('order')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly smartOrderService: SmartOrderService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Post('smart')
  async createSmartOrder(@Body() smartOrderDto: SmartOrderDto): Promise<SmartOrderResponseDto> {
    return this.smartOrderService.processSmartOrder(
      smartOrderDto.text,
      smartOrderDto.customerId,
    );
  }
}
