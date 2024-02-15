import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './Schema/category.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() category: Category,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Category> {
    return this.categoryService.create(category, file);
  }
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() category: Category,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Category> {
    return this.categoryService.update(id, category, file);
  }
  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.categoryService.delete(id);
  }
}
