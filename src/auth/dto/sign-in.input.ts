import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  login: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
