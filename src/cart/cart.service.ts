import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateServiceResponseDto } from 'src/service/dto/create-service-response.dto';
import { CartResponse } from './dto/cart-response.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartService {
    constructor(
      @InjectModel('Cart') private cartModel: Model<Cart>,
    ){}

  async create(createCartDto: CreateCartDto): Promise<CartResponse> {
    const newCart = new this.cartModel(createCartDto);
    const savedCart = await newCart.save();
    
    const populatedCart = await this.cartModel
        .findById(savedCart._id)
        .populate('customerId')
        .populate('items.itemId')
        .exec();
    
    if (!populatedCart) {
        throw new Error('Failed to create cart');
    }
    
    return plainToClass(CartResponse, populatedCart.toJSON(), { excludeExtraneousValues: true });
  }
  

  async findAll(): Promise<CartResponse[]> {
    const carts = await this.cartModel.find()
      .populate('customerId')
      .populate('items.itemId')
      .exec();
    if (!carts || carts.length === 0) {
      return [];
    }
    return carts.map(cart => 
      plainToClass(CartResponse, cart.toJSON(), { excludeExtraneousValues: true })
    );
  }

  async findOne(id: string): Promise<CartResponse> {
    const cart = await this.cartModel.findById(id)
      .populate('customerId')
      .populate('items.itemId')
      .exec();
    if (!cart) {
      throw new Error('Cart not found');
    }
    return plainToClass(CartResponse, cart.toJSON(), { excludeExtraneousValues: true });
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<CreateServiceResponseDto> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      return {
        success: false,
        message: `Cart not found`,
      };
    }
    await this.cartModel.updateOne({ _id: id }, updateCartDto);
    return {
      success: true,
      message: `Cart updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateServiceResponseDto> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      return {
        success: false,
        message: `Cart not found`,
      };
    }
    await this.cartModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Cart deleted successfully`,
    };
  }
}
