import {
 Entity, Column,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@/models/base/BaseModel';

@ObjectType({ description: 'app ' })
@Entity({
  name: 'app',
})
export class App extends BaseModel {
  @Column({
    name: 'user_id',
    type: 'varchar',
    unique: true,
    length: 64,
  })
  userId: string;

  @Field()
  @Column({
    name: 'object_app_id',
    type: 'varchar',
    length: 64,
  })
  objectAppId: string;

  @Field({ nullable: false })
  @Column({
    name: 'object_service_key',
    type: 'varchar',
    length: 256,
  })
  objectServiceKey: string;
}
