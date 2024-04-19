import { InputType, Int, Field } from '@nestjs/graphql';
import { PermissionConfigInput } from './permission-config.input';
import { OwnerType } from '../types/owner-type.enum';
import { ModelType } from '../types/model-type.enum';

@InputType()
export class CreatePermissionInput {
  @Field()
  owner_id: string;

  @Field()
  model_id: string;

  @Field(() => OwnerType)
  owner_type: OwnerType;

  @Field(() => ModelType)
  model_type: ModelType;

  @Field(() => Int)
  level: number;

  @Field(() => PermissionConfigInput, { nullable: true })
  config: PermissionConfigInput;
}
