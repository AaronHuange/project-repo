import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';
import { FormStatusEnum } from '@/models/base/interfaces';

@ObjectType()
export class FormFilterType extends BaseModel {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  parentId?: string;

  @Field(() => String)
  ownerId?: string;

  @Field(() => String)
  version?: string;

  @Field(() => Boolean)
  public?: boolean;

  @Field(() => Boolean)
  isNewest?: boolean;

  @Field(() => FormStatusEnum)
  status: FormStatusEnum;
}
