import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

@Schema()
export class UserEntity {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ select: false })
  name: string;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);

UserEntitySchema.pre<UserEntity>('save', async function (next) {
  this.password = await hash(this.password, 10);
  next();
});
