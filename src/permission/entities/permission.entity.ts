import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionConfig } from '../types/permission-config.type';
import { OwnerType } from '../types/owner-type.enum';
import { ModelType } from '../types/model-type.enum';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'permissions' })
@ObjectType()
export class Permission {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  model_id: string;

  @Field()
  @Column()
  owner_id: string;

  @Field(() => OwnerType)
  @Column({ type: 'enum', enum: OwnerType })
  owner_type: OwnerType;

  @Field(() => ModelType)
  @Column({ type: 'enum', enum: ModelType })
  model_type: ModelType;

  @Field(() => Int)
  @Column({ type: 'int' })
  level: number;

  @Field(() => PermissionConfig, { nullable: true })
  @Column({ type: 'json', nullable: true })
  config: PermissionConfig;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
