import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateForm1686744042985 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists form
        (
            id           varchar(255)                       not null,
            name         varchar(64)                        not null comment '表单名称',
            parent_id    varchar(64)                        null comment '父级表单id',
            json_field   json                               not null,
            creator_id   varchar(64)                        not null,
            creator_name varchar(64)                        not null,
            version      varchar(64)                        not null,
            public       tinyint  default 0                 not null,
            publish      tinyint  default 0                 not null,
            is_newest    tinyint  default 0                 not null,
            deleted      tinyint  default 0                 not null,
            deleted_at   datetime(6)                        null comment '删除时间',
            created_at   datetime default CURRENT_TIMESTAMP not null comment '创建时间',
            updated_at   datetime default CURRENT_TIMESTAMP not null comment '更新时间',
            primary key (id)
        );


    `);
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table form
    `);
  }
}
