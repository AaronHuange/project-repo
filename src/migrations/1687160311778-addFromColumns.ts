import { MigrationInterface, QueryRunner } from "typeorm"

export class AddFromColumns1687160311778 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          alter table form
              add column columns json comment 'columns 字段详情';
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        alter table form
            drop column columns;
    `);
    }

}
