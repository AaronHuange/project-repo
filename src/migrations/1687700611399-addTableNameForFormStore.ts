import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTableNameForFormStore1687700611399 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        alter table form_store
            add column table_name varchar(32) not null comment '表名';
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
