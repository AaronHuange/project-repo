import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormStore1686896869942 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table form_store
        (
            id            varchar(64)                        not null,
            form_id       varchar(64)                        not null,
            object_app_id varchar(64)                        not null,
            table_id      bigint                             not null,
            columns_meta  json                               not null,
            deleted_at    datetime(6) null comment '删除时间',
            created_at    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
            updated_at    datetime default CURRENT_TIMESTAMP not null comment '更新时间',
            primary key (id)
        );
    `);
    await queryRunner.query(` alter table form_store
        add unique index iu_form_id(form_id);
    `);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this,@typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table form_store');
  }
}
