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
    @Query('results') results: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const products = await this.productService.findAll();
    const totalPages = Math.ceil(results / pageSize);

    // Paginar los productos
    const paginatedProducts = products.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

    return { products: paginatedProducts, totalPages };
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
