import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApp1686744033397 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists app
        (
            id                 varchar(255)                       not null,
            user_id            varchar(64)                        not null,
            object_app_id      varchar(64)                        not null,
            object_service_key varchar(256)                       not null,
            deleted            tinyint  default 0                 not null,
            deleted_at         datetime(6)                        null comment '删除时间',
            created_at         datetime default CURRENT_TIMESTAMP not null comment '创建时间',
            updated_at         datetime default CURRENT_TIMESTAMP not null comment '更新时间',
            PRIMARY KEY (id)
        );
    `);
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table app
    `);
  }
}
