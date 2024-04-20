import { ObjectType, Field } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity({ name: 'chats' })
@ObjectType()
export class Chat {
  @PrimaryColumn()
  @Field()
  id: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'users_chats',
  })
  @Field(() => [User])
  members: User[];

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
