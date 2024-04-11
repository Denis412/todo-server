import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'messages' })
@ObjectType()
export class Message {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @Field(() => User)
  sender: User;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
