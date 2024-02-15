import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './Schema/product.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('/count')
  getCount(): Promise<number> {
    return this.productService.getCount();
  }
  @Get()
  async findAll(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    const products = await this.productService.findAll(offset, limit);
    const totalPages = await this.productService.getTotalPages(limit);

    const hasMorePages = offset < totalPages * limit - limit;

    return { products, hasMorePages, totalPages };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() product: Product,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.create(product, file);
  }
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() product: Product,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.update(id, product, file);
  }
  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.productService.delete(id);
  }
}
