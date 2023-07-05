import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteFormPermissionInput {
  @Field(() => [ID])
  id: string;

  @Field(() => String)
  formId: string;
}
