import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertyAccess } from './property-access.type';
import { Column } from 'typeorm';

@ObjectType()
export class PermissionConfig {
  @Field(() => [PropertyAccess], { nullable: true })
  properties_access: PropertyAccess[];

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  personal_access_level: number;
}
