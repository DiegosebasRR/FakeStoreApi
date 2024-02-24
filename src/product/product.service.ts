import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, productDocument } from './Schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { s3Service } from 'src/util/s3';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
    private readonly appService: s3Service,
  ) {}

  async getCount(): Promise<number> {
    try {
      const count = await this.productModel.countDocuments().exec();
      return count;
    } catch (error) {
      console.error('Error al obtener el recuento de productos:', error);
      throw error;
    }
  }

  async getTotalPages(limit: number): Promise<number> {
    try {
      const count = await this.getCount();
      return Math.ceil(count / limit);
    } catch (error) {
      console.error('Error al obtener el total de páginas:', error);
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .populate('Category')
        .exec();
      return products;
    } catch (error) {
      console.error('Error al buscar todos los productos:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      return await this.productModel.findById(id).exec();
    } catch (error) {
      console.error('Error al buscar el producto por ID:', error);
      throw error;
    }
  }

  async create(product: Product, file): Promise<Product> {
    try {
      const newProduct = new this.productModel(product);
      const image = await this.appService.uploadFile(file);
      if (image) {
        newProduct.image = {
          key: image.Key,
          location: image.Location,
        };
      }
      return await newProduct.save();
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  }

  async update(id: string, product: Product, file): Promise<Product> {
    try {
      if (file) {
        const productUpdate = await this.productModel.findById(id).exec();
        this.appService.deleteFile(productUpdate.image.key);
        const image = await this.appService.uploadFile(file);
        if (image) {
          product.image = {
            key: image.Key,
            location: image.Location,
          };
        }
      }
      return await this.productModel.findByIdAndUpdate(id, product, {
        new: true,
      });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const productDelete = await this.productModel.findById(id).exec();
      if (productDelete) {
        if (productDelete.image.key) {
          this.appService.deleteFile(productDelete.image.key);
        }
        await this.productModel.findByIdAndDelete(id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return false;
    }
  }
}
