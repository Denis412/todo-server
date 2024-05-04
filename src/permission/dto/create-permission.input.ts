import { InputType, Int, Field } from '@nestjs/graphql';
import { PermissionConfigInput } from './permission-config.input';
import { OwnerType } from '../types/owner-type.enum';
import { ModelType } from '../types/model-type.enum';
import { IsString, Matches } from 'class-validator';
import { RelationInput } from '../../shared';

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

  @Field({ nullable: true })
  model_name: string;

  @Field(() => RelationInput, { nullable: true })
  user: RelationInput;

  @Field(() => RelationInput, { nullable: true })
  group: RelationInput;

  @Field(() => Int)
  level: number;

  @Field(() => PermissionConfigInput, { nullable: true })
  config: PermissionConfigInput;
}
