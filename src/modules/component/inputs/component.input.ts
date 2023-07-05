// eslint-disable-next-line max-classes-per-file
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { FormStatusEnum } from '@/models/base/interfaces';

@InputType()
export class CreateComponentInputType {
  @Field()
  @MaxLength(64)
  name: string;

  @Field()
  @MaxLength(32)
  type: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(512)
  imgUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(128)
  industry?: string;

  @Field(() => Object, { nullable: true })
  @IsOptional()
  jsonField?: any;

  @Field({ nullable: true, defaultValue: false })
  public?: boolean;
}

@InputType()
export class UpdateComponentInputType extends PartialType(
  CreateComponentInputType,
) {
  @Field(() => FormStatusEnum, { nullable: true })
  status: FormStatusEnum;

  @Field({ nullable: true })
  deletedAt: Date;
}
