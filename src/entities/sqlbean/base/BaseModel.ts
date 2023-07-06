import {
 BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn,
} from 'typeorm';

export class BaseModel extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
  })
  id: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    comment: '删除时间',
  })
  deletedAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    comment: '创建时间',
    default: () => 'NOW()',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    comment: '更新时间',
    default: () => 'NOW()',
  })
  updatedAt?: Date;
}
