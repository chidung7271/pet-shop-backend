import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerResponseDto } from './dto/create-customer-response.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomerService {
  constructor(@InjectModel("Customer") private customerModel: Model<Customer>) {}
  
  
  async create(createCustomerDto: CreateCustomerDto): Promise<CreateCustomerResponseDto> {
    const newCustomer = new this.customerModel(createCustomerDto);
    await newCustomer.save();
    return {
      success: true,
      message: "Customer created successfully",
    };
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.customerModel.find();
    if (!customers || customers.length === 0) {
      return customers
    }
    return customers;
  }

  async findOne(id: string): Promise<Customer | null> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      return null;
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CreateCustomerResponseDto | null> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      return {
        success: false,
        message: `Customer not found`,
      };
    }
    await this.customerModel.updateOne({ _id: id }, updateCustomerDto);
    return {
      success: true,
      message: `Customer updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateCustomerResponseDto> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      return {
        success: false,
        message: `Customer not found`,
      };
    }
    await this.customerModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Customer deleted successfully`,
    };
  }
}
