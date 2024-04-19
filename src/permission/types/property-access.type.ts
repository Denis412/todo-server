import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType()
export class PropertyAccess {
  @Field()
  @Column()
  property_name: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  level: number;
}
