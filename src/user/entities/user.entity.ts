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
import { IsNotEmpty } from 'class-validator';
import { Project } from '../../project/entities/project.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Message } from '../../message/entities/message.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Group } from '../../group/entities/group.entity';

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
  @Field({ description: 'User id' })
  @PrimaryColumn()
  id: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  phone_number: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @Field()
  @Column({ unique: true })
  username: string;

  @Column(() => Fullname)
  // @Field(() => Fullname)
  fullname: Fullname;

  @Column({ nullable: false })
  password: string;

  @Field(() => [Project])
  @OneToMany(() => Project, (project) => project.members)
  @JoinTable({
    name: 'users_projects',
  })
  projects: Project[];

  @Field(() => [Chat])
  @ManyToMany(() => Chat, { eager: true })
  @JoinTable({
    name: 'users_chats',
  })
  chats: Chat[];

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.sender, { eager: true })
  messages: Message[];

  @Field(() => [Permission])
  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];

  @Field(() => [Group])
  @ManyToMany(() => Group, { eager: true, nullable: true })
  @JoinTable({
    name: 'users_groups',
  })
  groups: Group[];

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
