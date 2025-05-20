import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePetResponseDto } from './dto/create-pet-response.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './schema/pet.schema';

@Injectable()
export class PetService {
  constructor(
    @InjectModel('Pet') private petModel: Model<Pet>, // Replace 'any' with the actual type of your model
  ) {}
  
  async create(createPetDto: CreatePetDto): Promise<CreatePetResponseDto> {
    const newPet = new this.petModel(createPetDto);
    await newPet.save();
    return {
      success: true,
      message: "Pet created successfully",
    };
  }

  async findAll(): Promise<Pet[]> {
    const pets = await this.petModel.find();
    if (!pets || pets.length === 0) {
      return pets
    }
    return pets;
  }

  async findOne(id: string)  {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      return `Pet not found`;
    }
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<CreatePetResponseDto> {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      return {
        success: false,
        message: `Pet not found`,
      };
    }
    await this.petModel.updateOne({ _id: id }, updatePetDto);
    return {
      success: true,
      message: `Pet updated successfully`,
    };
  }

  async remove(id: string): Promise<CreatePetResponseDto> {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      return {
        success: false,
        message: `Pet not found`,
      };
    }
    await this.petModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Pet deleted successfully`,
    };
  }
}
