import { CreateGroupInput } from './create-group.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { RelationInput } from '../../shared';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  label: string;

  @Field(() => [RelationInput], { nullable: true })
  users: RelationInput[];
}
