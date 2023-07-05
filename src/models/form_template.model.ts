import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@ObjectType()
@Entity({
  name: 'form_template',
})
export class FormTemplate extends BaseModel {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
  })
  @Field()
  name?: string;

  @Column({
    name: 'theme_id',
    type: 'varchar',
    length: 64,
  })
  @Field()
  themeId?: string;

  @Column({
    name: 'json_field',
    type: 'json',
  })
  @Field(() => Object, { nullable: true })
  jsonField?: any;

  @Column({
    name: 'owner_id',
    type: 'varchar',
    length: 64,
  })
  @Field()
  ownerId?: string;

  @Column({
    name: 'scene',
    type: 'varchar',
    length: 64,
  })
  @Field()
  scene?: string;

  @Column({
    name: 'version',
    type: 'varchar',
    length: 64,
  })
  @Field()
  version?: string;

  @Column({
    name: 'img_url',
    type: 'varchar',
    length: 512,
  })
  @Field()
  imgUrl?: string;

  @Column({
    name: 'use_number',
    type: 'bigint',
  })
  @Field()
  useNumber?: number;

  @Column({
    name: 'preview_number',
    type: 'bigint',
  })
  @Field()
  previewNumber?: number;

  @Column({
    name: 'public',
    type: 'tinyint',
  })
  @Field()
  public?: boolean;
}
