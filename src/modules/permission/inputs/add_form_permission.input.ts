import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddFormPermissionInput {
  @Field()
  formId?: string;

  @Field(() => Object, { nullable: true })
  dataPermissions?: any;

  @Field(() => Object, { nullable: true })
  formPermissions?: any;

  @Field(() => String, { nullable: true })
  formDataTableName?: string;

  @Field(() => Date, { nullable: true })
  deadline?: Date;

  @Field(() => Object, { nullable: true })
  phones?: any;
}
