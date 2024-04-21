import { InputType, Field } from '@nestjs/graphql';
import { RelationInput } from '../../shared';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateGroupInput {
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
