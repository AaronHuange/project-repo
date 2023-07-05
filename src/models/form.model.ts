import { Entity, Column, CreateDateColumn } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';
import { FormStatusEnum } from '@/models/base/interfaces';
import { FormColumnType } from '@/modules/form/types/form.type';

registerEnumType(FormStatusEnum, {
  name: 'FormStatusEnum',
});

@Entity({
  name: 'form',
})
@ObjectType()
export class Form extends BaseModel {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
    comment: '表单名称',
  })
  @Field(() => String)
  name?: string;

  @Column({
    name: 'parent_id',
    type: 'varchar',
    length: 64,
    comment: '父级表单id',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  parentId?: string;

  @Column({
    name: 'json_field',
    type: 'json',
  })
  @Field(() => Object, { nullable: true })
  jsonField?: any;

  @Column({
    name: 'columns',
    type: 'json',
  })
  @Field(() => [FormColumnType], { nullable: true })
  columns?: FormColumnType[];

  @Column({
    name: 'publish_json_field',
    type: 'json',
  })
  @Field(() => Object, { nullable: true })
  publishJsonField?: any;

  @Column({
    name: 'publish_columns',
    type: 'json',
  })
  @Field(() => [FormColumnType], { nullable: true })
  publishColumns?: FormColumnType[];

  @Field(() => Date)
  @CreateDateColumn({
    name: 'published_at',
    type: 'datetime',
  })
  publishedAt?: Date;

  @Column({
    name: 'owner_id',
    type: 'varchar',
    length: 64,
  })
  @Field(() => String)
  ownerId?: string;

  @Column({
    name: 'version',
    type: 'varchar',
    length: 64,
  })
  @Field(() => String)
  version?: string;

  @Column({
    name: 'scene',
    type: 'varchar',
    length: 32,
  })
  @Field(() => String)
  scene?: string;

  @Column({
    name: 'public',
    type: 'tinyint',
    default: false,
  })
  @Field(() => Boolean)
  public?: boolean;

  @Column({
    name: 'publish',
    type: 'tinyint',
    default: false,
  })
  @Field(() => Boolean)
  publish?: boolean;

  @Column({
    name: 'is_newest',
    type: 'tinyint',
    default: false,
  })
  @Field(() => Boolean)
  isNewest?: boolean;

  @Column({
    name: 'status',
    default: FormStatusEnum.draft,
  })
  @Field(() => FormStatusEnum, { defaultValue: FormStatusEnum.draft })
  status: FormStatusEnum;
}
