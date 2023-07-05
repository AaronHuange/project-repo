import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAllCreatorId1686884780374 implements MigrationInterface {
  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table component
            change creator_id owner_id varchar(64) not null comment '拥有者ID';
    `);
    await queryRunner.query(`
        alter table form_template
            change creator_id owner_id varchar(64) not null comment '拥有者ID';
    `);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this,@typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
