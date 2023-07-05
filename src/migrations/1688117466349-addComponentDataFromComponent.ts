import { MigrationInterface, QueryRunner } from 'typeorm'
import * as readline from 'readline';
import * as fs from 'fs';
import * as process from 'process';


export class AddComponentDataFromComponent1688117466349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('delete from component where owner_id = \'admin\'');
      await queryRunner.query('delete from form_template where owner_id = \'admin\'');
      const componentsFileStream = fs.createReadStream(
        `${process.cwd()}/dist/migrations/resource/components_2023_06_30.sql`,
        {
          encoding: 'utf8',
        }
      );
      const componentsRl = readline.createInterface({
        input: componentsFileStream,
        crlfDelay: Infinity,
      });
      for await (const sql of componentsRl) {
        await queryRunner.query(sql);
      }

      const formTemplatesFileStream = fs.createReadStream(
        `${process.cwd()}/dist/migrations/resource/form_templates_2023_06_30.sql`,
        {
          encoding: 'utf8',
        }
      );
      const formTemplatesRl = readline.createInterface({
        input: formTemplatesFileStream,
        crlfDelay: Infinity,
      });
      for await (const sql of formTemplatesRl) {
        await queryRunner.query(sql);
      }

      await queryRunner.query('update component set public = 1 where owner_id = \'admin\'');
      await queryRunner.query('update form_template set public = 1 where owner_id = \'admin\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
