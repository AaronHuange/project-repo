import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFormStatus1686812180878 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table form
            add column status varchar(32) not null default 'draft' comment '表单状态：draft/published/trashed';
    `);
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table form
            drop column status;
    `);
  }
}
