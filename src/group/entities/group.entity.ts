import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity({ name: 'groups' })
@ObjectType()
export class Group {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  label: string;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
    name: 'users_groups',
  })
  users: User[];

  @ManyToOne(() => Permission, (permission) => permission.group)
  permissions: Permission[];

  @Field()
  @Column({ nullable: true })
  author_id: string;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
