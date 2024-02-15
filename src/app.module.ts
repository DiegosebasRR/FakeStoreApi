import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:5vqvMDlrNhZ9v9rN@fakestoredb.yvz22ix.mongodb.net/?retryWrites=true&w=majority',
    ),
    ProductModule,
    CategoryModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
