import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;
@Schema()
export class Auth {
  // @Prop()
  // name: string;
  @Prop({ immutable: true })
  username: string;

  @Prop()
  password: string;

  // @Prop()
  // role: string;
  // @Prop({
  //   type: {
  //     key: { type: String },
  //     location: { type: String },
  //   },
  // })
  // image: {
  //   type: {
  //     key: string;
  //     location: string;
  //   };
  // };
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
