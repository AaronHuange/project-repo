import { Column, Entity } from 'typeorm';
import { BaseModel } from '@/entities/sqlbean/base/BaseModel';

@Entity({
  name: 'user',
})
export class User extends BaseModel {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
    comment: '用户名',
  })
  name?: string;

  @Column({
    name: 'user_picture',
    type: 'json',
    comment: '用户画像',
  })
  picture?: any;

  @Column({
    name: 'labels',
    type: 'json',
    comment: '用户标签',
  })
  columns?: string[];

  @Column({
    name: 'public',
    type: 'tinyint',
    default: false,
    comment: '是否是管理员',
  })
  isAdmin?: boolean;
}
