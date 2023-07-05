import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WhereInput {
  @Field(() => Object, { nullable: true })
  where?: any;
}
