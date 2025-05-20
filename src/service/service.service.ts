import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceResponseDto } from './dto/create-service-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './schema/service.schema';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service') private serviceModel: Model<Service>, // Replace 'any' with the actual type of your model
  ) {}
  
  async create(createServiceDto: CreateServiceDto): Promise<CreateServiceResponseDto> {
    const newService = new this.serviceModel(createServiceDto);
    await newService.save();
    return {
      success: true,
      message: "Service created successfully",
    };
  }

  async findAll(): Promise<Service[]> {
    const services = await this.serviceModel.find();
    if (!services || services.length === 0) {
      return services
    }
    return services;
  }

  async findOne(id: string)  {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      return `Service not found`;
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<CreateServiceResponseDto> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      return {
        success: false,
        message: `Service not found`,
      };
    }
    await this.serviceModel.updateOne({ _id: id }, updateServiceDto);
    return {
      success: true,
      message: `Service updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateServiceResponseDto> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      return {
        success: false,
        message: `Service not found`,
      };
    }
    await this.serviceModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Service deleted successfully`,
    };
  }
}
