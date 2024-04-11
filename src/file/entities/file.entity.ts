import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity({ name: 'files' })
@ObjectType()
export class File {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  short_link: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  extension: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  size: number;

  @OneToMany(() => Task, (task) => task.files)
  task: Task;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
