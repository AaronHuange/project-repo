import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComponent1686744049159 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists component
        (
            id             varchar(255)                       not null,
            name           varchar(64)                        not null,
            type           varchar(64)                        not null,
            img_url        varchar(64)                        null,
            industry       varchar(128)                       null,
            json_field     json                               null,
            creator_id     varchar(64)                        not null,
            public         tinyint                            not null,
            use_number     bigint                             not null,
            preview_number bigint                             not null,
            deleted        tinyint  default 0                 not null,
            deleted_at     datetime(6)                        null comment '删除时间',
            created_at     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
            updated_at     datetime default CURRENT_TIMESTAMP not null comment '更新时间',
            primary key (id)
        );
    `);
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table component
    `);
  }
}
