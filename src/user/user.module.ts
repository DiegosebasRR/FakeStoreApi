import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { s3Service } from 'src/util/s3';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, s3Service],
})
export class UserModule {}
