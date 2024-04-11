import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'groups' })
@ObjectType()
export class Group {
  @PrimaryColumn()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  @Field()
  label: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @Column({ nullable: true })
  @Field()
  author_id: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
