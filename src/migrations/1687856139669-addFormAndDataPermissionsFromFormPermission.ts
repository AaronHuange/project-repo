import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFormAndDataPermissionsFromFormPermission1687856139669 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table form_permission
            add column form_permissions JSON comment '表单权限';
    `);
    await queryRunner.query(`
        alter table form_permission
            add column data_permissions JSON comment '表单数据权限';
    `);
    await queryRunner.query(`
        delete
        from form_permission
        where 1 = 1;
    `);
    await queryRunner.query(`
        alter table form_permission
            drop column \`type\`;
    `);
    await queryRunner.query(`
        alter table form_permission
            drop column \`permissions\`;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
