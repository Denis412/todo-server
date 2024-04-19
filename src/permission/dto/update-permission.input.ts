import { CreatePermissionInput } from './create-permission.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { PermissionConfigInput } from './permission-config.input';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @Field(() => Int)
  level: number;

  @Field(() => PermissionConfigInput, { nullable: true })
  config: PermissionConfigInput;
}
