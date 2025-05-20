import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
    @Body() createProductDto: CreateProductDto): Promise<CreateProductResponseDto> {
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    createProductDto.imageUrl = imageUrl;
    return this.productService.create(createProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async update(@Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() updateProductDto: UpdateProductDto): Promise<CreateProductResponseDto> {
    if (file) {
      const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
      updateProductDto.imageUrl = imageUrl;
    }
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CreateProductResponseDto> {
    return this.productService.remove(id);
  }
}
