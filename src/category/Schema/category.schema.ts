import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop()
  name: string;
  @Prop({
    type: {
      key: { type: String },
      location: { type: String },
    },
  })
  image: {
    key: string;
    location: string;
  };
}

export const CategorySchema = SchemaFactory.createForClass(Category);
