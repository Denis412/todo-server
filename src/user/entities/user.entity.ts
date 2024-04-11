import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Project } from '../../project/entities/project.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Message } from '../../message/entities/message.entity';

export class Fullname {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column({ nullable: true })
  last_name: string;
}

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field({ description: 'User id' })
  id: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  phone_number: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @IsNotEmpty()
  @Column({ unique: true })
  @Field()
  username: string;

  @Column(() => Fullname)
  // @Field(() => Fullname)
  fullname: Fullname;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Project, (project) => project.members)
  @JoinTable()
  @Field(() => Project)
  projects: Project[];

  @ManyToMany(() => Chat)
  @JoinTable()
  @Field(() => Chat)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  @Field(() => Message)
  messages: Message[];

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
