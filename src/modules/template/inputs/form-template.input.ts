/* eslint-disable max-classes-per-file */
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateFormTemplateInputType {
  @Field()
  name?: string;

  @Field({ nullable: true })
  scene?: string;

  @Field({ nullable: true, defaultValue: '' })
  themeId?: string;

  @Field(() => Object, { nullable: true })
  jsonField?: any;

  @Field({ nullable: true, defaultValue: '' })
  version?: string;

  @Field({ nullable: true, defaultValue: '' })
  imgUrl?: string;

  @Field({ nullable: true })
  public?: boolean;
}

@InputType()
export class UpdateFormTemplateInputType extends PartialType(
  CreateFormTemplateInputType,
) {
  @Field({ nullable: true })
  deletedAt: Date;
}

@InputType()
export class DestroyFormTemplateInputType {
  @Field()
  id: string;
}
