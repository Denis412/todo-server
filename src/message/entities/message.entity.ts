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
import { Chat } from '../../chat/entities/chat.entity';

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

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
