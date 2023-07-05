import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@ObjectType({ description: 'component ' })
@Entity({
  name: 'component',
})
export class Component extends BaseModel {
  @Field()
  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
  })
  name: string;

  @Field()
  @Column({
    name: 'type',
    type: 'varchar',
    length: 64,
  })
  type: string;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'img_url',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  imgUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'industry',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  industry?: string;

  @Field(() => Object, { nullable: true })
  @Column({
    name: 'json_field',
    type: 'json',
    nullable: true,
  })
  jsonField?: any;

  @Column({
    name: 'owner_id',
    type: 'varchar',
    length: 64,
  })
  @Field()
  ownerId?: string;

  @Field(() => Boolean)
  @Column({
    name: 'public',
    type: 'tinyint',
  })
  public?: boolean;

  @Field(() => Number)
  @Column({
    name: 'use_number',
    type: 'bigint',
  })
  useNumber?: number;

  @Field(() => Number)
  @Column({
    name: 'preview_number',
    type: 'bigint',
  })
  previewNumber?: number;
}
