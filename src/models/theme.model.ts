import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@Entity({
  name: 'theme',
})
@ObjectType()
export class Theme extends BaseModel {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  @Field()
  name?: string;

  @Column({
    name: 'color',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  @Field()
  color?: string;

  @Column({
    name: 'json_field',
    type: 'json',
    nullable: true,
  })
  @Field(() => Object)
  jsonField?: any;

  @Column({
    name: 'img',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  img?: string;

  @Column({
    name: 'style',
    type: 'json',
    nullable: true,
  })
  style?: any;

  @Column({
    name: 'blocks_style',
    type: 'json',
    nullable: true,
  })
  blocksStyle?: any;

  @Column({
    name: 'header',
    type: 'json',
    nullable: true,
  })
  header?: any;

  @Column({
    name: 'button',
    type: 'json',
    nullable: true,
  })
  button?: any;

  @Field()
  imgUrl?: string;
}
