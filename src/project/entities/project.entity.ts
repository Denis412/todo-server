import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'projects' })
@ObjectType()
export class Project {
  @PrimaryColumn()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, (user) => user.projects)
  @Field(() => User)
  @JoinColumn({
    name: 'usersId',
  })
  lead: User;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
    name: 'users_projects',
  })
  members: User[];

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
