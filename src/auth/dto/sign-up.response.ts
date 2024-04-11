import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignUpResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;
}
