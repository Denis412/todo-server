import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class PropertyAccessInput {
  @Field()
  property_name: string;

  @Field(() => Int)
  level: number;
}

@InputType()
export class PermissionConfigInput {
  @Field(() => [PropertyAccessInput], { nullable: true })
  properties_access: PropertyAccessInput[];

  @Field(() => Int, { nullable: true })
  personal_access_level: number;
}
