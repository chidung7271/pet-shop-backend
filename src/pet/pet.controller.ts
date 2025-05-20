import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePetResponseDto } from './dto/create-pet-response.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetService } from './pet.service';

@Controller('pet')
@UseGuards(AuthGuard('jwt'))
export class PetController {
  constructor(private readonly petService: PetService) {}



  @Post()
  @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPetDto: CreatePetDto): Promise<CreatePetResponseDto> {
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    createPetDto.image = imageUrl;
    return this.petService.create(createPetDto);
  }

  @Get()
  async findAll() {
    return this.petService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<CreatePetResponseDto> {
    
    return this.petService.update(id, updatePetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CreatePetResponseDto> {
    return this.petService.remove(id);
  }
}
