import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormPermission1686744063864 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists form_permission
        (
            id                   varchar(255)                       not null,
            type                 varchar(64)                        not null comment 'form/data',
            permissions          json                               null,
            form_data_table_name varchar(64)                        not null,
            form_id              varchar(64)                        not null comment '表单id',
            user_id              varchar(64)                        not null,
            deadline             datetime                           null,
            owner_id             varchar(64)                        not null,
            deleted              tinyint  default 0                 not null,
            deleted_at           datetime(6)                        null comment '删除时间',
            created_at           datetime default CURRENT_TIMESTAMP not null comment '创建时间',
            updated_at           datetime default CURRENT_TIMESTAMP not null comment '更新时间',
            primary key (id)
        );

    `);
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table form_permission
    `);
  }
}
