import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>, // Replace 'any' with the actual type of your model
  ) {}
  
  async create(createProductDto: CreateProductDto): Promise<CreateProductResponseDto> {
    const newProduct = new this.productModel(createProductDto);
    await newProduct.save();
    return {
      success: true,
      message: "Product created successfully",
    };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find();
    if (!products || products.length === 0) {
      return products
    }
    return products;
  }

  async findOne(id: string)  {
    const product = await this.productModel.findById(id);
    if (!product) {
      return `Product not found`;
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<CreateProductResponseDto> {
    const product = await this.productModel.findById(id);
    if (!product) {
      return {
        success: false,
        message: `Product not found`,
      };
    }
    await this.productModel.updateOne({ _id: id }, updateProductDto);
    return {
      success: true,
      message: `Product updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateProductResponseDto> {
    const product = await this.productModel.findById(id);
    if (!product) {
      return {
        success: false,
        message: `Product not found`,
      };
    }
    await this.productModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Product deleted successfully`,
    };
  }
}
