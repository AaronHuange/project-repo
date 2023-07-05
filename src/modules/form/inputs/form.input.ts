/* eslint-disable max-classes-per-file */
import { Field, InputType, PartialType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Type } from 'class-transformer';
import {
  IsArray, IsIn, IsNotEmpty, IsString, ValidateNested,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { FormStatusEnum } from '@/models/base/interfaces';

@InputType()
export class FormColumnInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['string', 'number', 'date', 'bool', 'json'])
  @Field()
  type: string;

  @Field({ nullable: true })
  label?: string;
}

@InputType()
export class CreateFormInputType {
  @Field()
  name?: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => Object, { nullable: true })
  jsonField?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Optional()
  @Type(() => FormColumnInput)
  @Field(() => [FormColumnInput], { nullable: true })
  columns: FormColumnInput[];

  @Field({ nullable: true })
  version?: string;

  @Field({ nullable: true })
  scene?: string;

  @Field({ nullable: true })
  public?: boolean;

  @Field({ nullable: true })
  publish?: boolean;

  @Field({ nullable: true })
  isNewest?: boolean;
}

@InputType()
export class UpdateFormInputType extends PartialType(CreateFormInputType) {
  @Field(() => FormStatusEnum, { nullable: true })
  status: FormStatusEnum;

  deletedAt: Date;
}

@InputType()
export class DestroyFormInputType {
  @Field()
  id: string;
}

@InputType()
export class QueryShowFormInputType {
  @Field()
  id: string;

  @Field(() => FormStatusEnum, { nullable: true })
  status?: FormStatusEnum;
}
