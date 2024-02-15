import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './Schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(user: User, file): Promise<User> {
    return this.userService.create(user, file);
  }
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(id: string, user: User, file): Promise<User> {
    return this.userService.update(id, user, file);
  }
  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}
