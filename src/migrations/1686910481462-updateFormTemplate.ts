import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFormTemplate1686910481462 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table form_template
            modify use_number bigint not null default 0 comment '使用次数';
    `);
    await queryRunner.query(`
        alter table form_template
            modify preview_number bigint not null default 0 comment '预览次数';
    `);
    await queryRunner.query(`
        alter table form_template
            modify public tinyint not null default 0 comment '是否公开';
    `);
    await queryRunner.query(`
        alter table form_template
            drop publish;
    `);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this,@typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
