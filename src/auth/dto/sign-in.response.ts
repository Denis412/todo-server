import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field()
  user_id: string;

  @Field()
  type: string;
}
