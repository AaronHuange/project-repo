import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FormColumnType {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  componentType?: string;
}
