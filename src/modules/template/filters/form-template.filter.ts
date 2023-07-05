import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@ObjectType()
export class FormTemplateFilterType extends BaseModel {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  ownerId?: string;

  @Field(() => String)
  scene?: string;

  @Field(() => Boolean)
  public?: boolean;

  @Field(() => Boolean)
  isNewest?: boolean;

  @Field(() => String)
  themeId?: String;
}
