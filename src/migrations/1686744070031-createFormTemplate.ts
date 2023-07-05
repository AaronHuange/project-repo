import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormTemplate1686744070031 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists form_template
        (
            id             varchar(255)                       not null,
            name           varchar(64)                        not null,
            theme_id       varchar(64)                        not null,
            json_field     json                               not null,
            creator_id     varchar(64)                        not null,
            scene          varchar(64)                        not null,
            version        varchar(64)                        not null,
            img_url        varchar(512)                       not null,
            use_number     bigint                             not null,
            preview_number bigint                             not null,
            public         tinyint                            not null,
            publish        tinyint                            not null,
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
        drop table form_template
    `);
  }
}
