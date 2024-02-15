import mongoose, { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
export type productDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  Category: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
