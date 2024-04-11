import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from '../../file/entities/file.entity';

@Entity({ name: 'tasks' })
@ObjectType()
export class Task {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  text: string;

  @OneToMany(() => File, (file: File) => file.task, { nullable: true })
  @Field(() => File, { nullable: true })
  files: File[];

  @Column()
  @Field()
  author_id: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}
