import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrderByInput {
  @Field(() => String, { nullable: true })
  orderByDesc?: string;

  @Field(() => String, { nullable: true })
  orderByAsc?: string;
}
