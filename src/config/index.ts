import { Logger } from '@nestjs/common';
import { Logger as TypeormLogger } from 'typeorm';
import entities from '../models/index';
import { migrations } from '@/migrations';
import { subscribers } from '@/config/subscribers';

class BridgeTypeormLogger implements TypeormLogger {
  private logger = new Logger('Typeorm');

  log(level: 'log' | 'info' | 'warn', message: any): any {
    this.logger[level](message);
  }

  logMigration(message: string): any {
    this.logger.log(`logMigration ${message}`);
  }

  logQuery(query: string, parameters?: any[]): any {
    this.logger.debug(`logQuery ${query}  ${parameters ? ` --- "${parameters?.join('","')}"` : ''}`);
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]): any {
    this.logger.warn(`logQueryError ${error} ${query}  ${parameters ? ` --- "${parameters?.join('","')}"` : ''}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): any {
    this.logger.warn(`logQuerySlow ${time} ${query} ${parameters ? ` --- "${parameters?.join('","')}"` : ''}`);
  }

  logSchemaBuild(message: string): any {
    this.logger.log(`logSchemaBuild ${message}`);
  }
}

export default {
  typeOrm: {
    type: 'mysql',
    host: process.env.DATABASE_URL_HOST,
    port: process.env.DATABASE_URL_PORT,
    database: process.env.DATABASE_URL_DATABASE,
    username: process.env.DATABASE_URL_USERNAME,
    password: process.env.DATABASE_URL_PASSWORD,
    entities,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['query'],
    maxQueryExecutionTime: 1500, // 慢查询记录
    subscribers,
    logger: new BridgeTypeormLogger(),
  },
};
