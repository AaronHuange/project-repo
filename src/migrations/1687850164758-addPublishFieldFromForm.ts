import { MigrationInterface, QueryRunner } from "typeorm"

export class AddPublishFieldFromForm1687850164758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        alter table form
            add column publish_json_field JSON comment '已发布的表单结构';
    `);
      await queryRunner.query(`
          alter table form
              add column publish_columns JSON comment '已发布的字段结构';
      `);
      await queryRunner.query(`
          alter table form
              add column published_at datetime comment '发布的时间';
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
