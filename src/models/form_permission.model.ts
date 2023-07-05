import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@Entity({
  name: 'form_permission',
})
@ObjectType()
export class FormPermission extends BaseModel {
  @Column({
    name: 'form_permissions',
    type: 'json',
    nullable: true,
  })
  @Field(() => Object, { nullable: true })
  formPermissions?: Array<String>;

  @Column({
    name: 'data_permissions',
    type: 'json',
    nullable: true,
  })
  @Field(() => Object, { nullable: true })
  dataPermissions?: Array<String>;

  @Field()
  @Column({
    name: 'form_data_table_name',
    type: 'varchar',
    length: 64,
  })
  formDataTableName?: string;

  @Field()
  @Column({
    name: 'form_id',
    type: 'varchar',
    length: 64,
    comment: '表单id',
  })
  formId?: string;

  @Field()
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  userId: string;

  @Field(() => Date)
  @Column({
    name: 'deadline',
    type: 'datetime',
    nullable: true,
  })
  deadline?: Date;
}
