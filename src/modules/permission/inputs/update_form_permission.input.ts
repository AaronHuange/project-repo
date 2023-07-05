import { Field, InputType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class UpdateFormPermissionInput {
  @Field()
  id: string;

  @Field({
    defaultValue: '',
    nullable: true,
  })
  userId?: string;

  @Field(() => Object)
  @Column({
    name: 'data_permissions',
    type: 'json',
    nullable: true,
  })
  dataPermissions?: any;

  @Field(() => Object)
  @Column({
    name: 'form_permissions',
    type: 'json',
    nullable: true,
  })
  formPermissions?: any;

  @Field(() => String, { nullable: true })
  formDataTableName?: string;

  @Field(() => String, { nullable: true })
  formId?: string;

  @Field(() => Date, { nullable: true })
  deadline?: Date;
}
