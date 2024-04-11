import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @Field({ nullable: true })
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  username: string;

  @Field({ nullable: true })
  first_name: string;

  @Field({ nullable: true })
  middle_name: string;

  @Field({ nullable: true })
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
