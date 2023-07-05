import { Column, Entity } from 'typeorm';
import { BaseModel } from '@/models/base/BaseModel';

@Entity({
  name: 'form_store',
})
export class FormStore extends BaseModel {
  @Column({
    name: 'form_id',
    type: 'varchar',
    length: 64,
    comment: '表单名称',
    unique: true,
  })
  formId: string;

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 32,
    comment: '表名',
    unique: true,
  })
  tableName: string;

  @Column({
    name: 'object_app_id',
    type: 'varchar',
    length: 64,
  })
  objectAppId: string;

  @Column({
    name: 'table_id',
    type: 'bigint',
  })
  tableId: number;

  @Column({
    name: 'columns_meta',
    type: 'json',
  })
  columnsMeta: any;
}
