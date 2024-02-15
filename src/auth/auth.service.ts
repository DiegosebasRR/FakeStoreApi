import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './Schema/auth.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private userModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ username: username }).exec();
      if (user && (await bcrypt.compare(password, user.password))) {
        const { ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async login(user: any) {
    try {
      const payload = { username: user.username, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new NotFoundException('Error al iniciar sesión');
    }
  }

  async register(username: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = new this.userModel({
        username: username,
        password: hashedPassword,
      });
      return createdUser.save();
    } catch (error) {
      throw new NotFoundException('Error al registrar usuario');
    }
  }
}
