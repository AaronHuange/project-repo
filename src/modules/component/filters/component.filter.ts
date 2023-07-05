import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseModel } from '@/models/base/BaseModel';

@ObjectType()
export class ComponentFilterType extends BaseModel {
  @Field()
  @MaxLength(64)
  name: string;

  @Field()
  @MaxLength(32)
  type: string;

  @Field()
  ownerId?: string;

  @Field()
  @MaxLength(128)
  industry?: string;

  @Field()
  public?: boolean;
}
