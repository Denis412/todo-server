import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RelationInput {
  @Field()
  id: string;
}
