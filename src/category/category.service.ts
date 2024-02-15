import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './Schema/category.schema';
import { Model } from 'mongoose';
import { s3Service } from 'src/util/s3';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly appService: s3Service,
  ) {}

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      console.error('Error al buscar todas las categorías:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Category> {
    try {
      return await this.categoryModel.findById(id).exec();
    } catch (error) {
      console.error('Error al buscar la categoría por ID:', error);
      throw error;
    }
  }

  async create(category: Category, file): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(category);
      const image = await this.appService.uploadFile(file);
      if (image) {
        newCategory.image = {
          key: image.Key,
          location: image.Location,
        };
      }
      return await newCategory.save();
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      throw error;
    }
  }

  async update(id: string, category: Category, file): Promise<Category> {
    try {
      if (file) {
        const categoryToUpdate = await this.categoryModel.findById(id).exec();
        if (categoryToUpdate.image.key) {
          this.appService.deleteFile(categoryToUpdate.image.key);
        }
        const image = await this.appService.uploadFile(file);
        if (image) {
          categoryToUpdate.image = {
            key: image.Key,
            location: image.Location,
          };
        }
      }
      return await this.categoryModel.findByIdAndUpdate(id, category, {
        new: true,
      });
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const categoryDelete = await this.categoryModel.findById(id).exec();
      if (categoryDelete) {
        if (categoryDelete.image.key) {
          this.appService.deleteFile(categoryDelete.image.key);
        }
        await this.categoryModel.findByIdAndDelete(id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      return false;
    }
  }
}
