import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './Schema/user.schema';
import { Model } from 'mongoose';
import { s3Service } from 'src/util/s3';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly appService: s3Service,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error al buscar todos los usuarios:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      console.error('Error al buscar el usuario por ID:', error);
      throw error;
    }
  }

  async create(user: User, file): Promise<User> {
    try {
      const newUser = new this.userModel(user);
      const image = await this.appService.uploadFile(file);
      if (image) {
        newUser.image = {
          key: image.Key,
          location: image.Location,
        };
      }
      return await newUser.save();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }

  async update(id: string, user: User, file): Promise<User> {
    try {
      if (file) {
        const userToUpdate = await this.userModel.findById(id).exec();
        this.appService.deleteFile(userToUpdate.image.key);
        const image = await this.appService.uploadFile(file);
        if (image) {
          userToUpdate.image = {
            key: image.Key,
            location: image.Location,
          };
        }
      }
      return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const userToDelete = await this.userModel.findById(id).exec();
      if (userToDelete) {
        if (userToDelete.image.key) {
          this.appService.deleteFile(userToDelete.image.key);
        }
        await this.userModel.findByIdAndDelete(id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return false;
    }
  }
}
