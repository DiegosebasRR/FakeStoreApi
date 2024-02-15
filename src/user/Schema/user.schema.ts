import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop()
  name: string;
  @Prop({ immutable: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
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

export const UserSchema = SchemaFactory.createForClass(User);
