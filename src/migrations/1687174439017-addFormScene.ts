import { MigrationInterface, QueryRunner } from "typeorm"

export class AddFormScene1687174439017 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table form
                add column scene varchar(32) not null default '' comment '表单场景';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table form
                drop column scene;
        `);
    }

}
