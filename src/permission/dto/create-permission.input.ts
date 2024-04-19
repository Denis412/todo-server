import { InputType, Int, Field } from '@nestjs/graphql';
import { PermissionConfigInput } from './permission-config.input';
import { OwnerType } from '../types/owner-type.enum';
import { ModelType } from '../types/model-type.enum';
import { IsString, Matches } from 'class-validator';

@InputType()
export class CreatePermissionInput {
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'String must consist only of digits' })
  @Field()
  owner_id: string;

  @IsString()
  @Matches(/^[0-9]+$/, { message: 'String must consist only of digits' })
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
