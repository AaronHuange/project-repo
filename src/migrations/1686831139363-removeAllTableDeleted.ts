import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAllTableDeleted1686831139363 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table app
            drop column deleted;
    `);
    await queryRunner.query(`
        alter table form
            drop column deleted;
    `);
    await queryRunner.query(`
        alter table form_permission
            drop column deleted;
    `);
    await queryRunner.query(`
        alter table form_template
            drop column deleted;
    `);
    await queryRunner.query(`
        alter table component
            drop column deleted;
    `);
    await queryRunner.query(`
        alter table theme
            drop column deleted;
    `);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
