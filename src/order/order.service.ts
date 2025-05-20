import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceResponseDto } from 'src/service/dto/create-service-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>, // Replace 'any' with the actual type of your model
  ) {}
  
  async create(createOrderDto: CreateOrderDto): Promise<CreateServiceResponseDto> {
    const newOrder = new this.orderModel(createOrderDto);
    await newOrder.save();
    return {
      success: true,
      message: "Order created successfully",
    };
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel.find();
    if (!orders || orders.length === 0) {
      return orders
    }
    return orders;
  }

  async findOne(id: string)  {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return `Order not found`;
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<CreateServiceResponseDto> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return {
        success: false,
        message: `Order not found`,
      };
    }
    await this.orderModel.updateOne({ _id: id }, updateOrderDto);
    return {
      success: true,
      message: `Order updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateServiceResponseDto> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return {
        success: false,
        message: `Order not found`,
      };
    }
    await this.orderModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Order deleted successfully`,
    };
  }
}
