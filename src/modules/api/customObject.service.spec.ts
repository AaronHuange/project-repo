import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { CustomObjectAuthorization, CustomObjectService } from '@/modules/api/customObject.service';

describe('apiService', () => {
  let customObjectService: CustomObjectService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule,
        WinstonModule.forRootAsync({
          useFactory: () => ({
            // options
          }),
          inject: [],
        }),
      ],
      controllers: [],
      providers: [CustomObjectService],
    })
      .compile();
    customObjectService = module.get<CustomObjectService>(CustomObjectService);
  });
  const authorization: CustomObjectAuthorization = {
    objectAppId: 'uK9vCDQMJEWNmeKi',
    // eslint-disable-next-line max-len
    userAuthorization: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiSnFIRXNGalc1THpra2diOCIsImNyZWF0ZWRfYXQiOjE2ODYyODAwMTEsImV4cCI6MTY4Njg4NDgxMX0.Mbi1yASAMG1x7HBg2FFYqL5IBFedEfyrPnwpYenJ_lA',
  };

  const createTable = async (tableName: string) => {
    const tables = await customObjectService.tables(authorization);
    if (tables.length) {
      const table = tables.find((item) => (item.name === tableName));
      if (table) {
        await customObjectService.deleteTable(authorization, table.id);
      }
    }
    return customObjectService.createTable(authorization, { name: tableName });
  };

  it('createUserInfo', async () => {
    const tableName = 'test_table_1';
    const newTable = await createTable(tableName);
    const queryTable = await customObjectService.findTable(authorization, newTable.id);
    expect(queryTable.id)
      .toBeDefined();
  });

  it('createTableColumn', async () => {
    const tableName = 'test_table_2';
    const newTable = await createTable(tableName);

    const newCol = await customObjectService.createColumn(authorization, {
      table_id: newTable.id,
      name: 'test_col',
      type: 'text',
    });

    expect(newCol.table)
      .toEqual(tableName);

    const queryTable = await customObjectService.findTable(authorization, newTable.id);

    expect(queryTable.columns)
      .toHaveLength(1);

    expect(queryTable.columns[0].id)
      .toBe(newCol.id);
  });

  it('deleteTableColumn', async () => {
    const tableName = 'test_table_3';
    const newTable = await createTable(tableName);

    const newCol = await customObjectService.createColumn(authorization, {
      table_id: newTable.id,
      name: 'test_col',
      type: 'text',
    });

    await customObjectService.deleteColumn(authorization, newCol.id);

    const queryTable = await customObjectService.findTable(authorization, newTable.id);
    expect(queryTable.columns)
      .toHaveLength(0);
  });

  it('updateTableColumn', async () => {
    const tableName = 'test_table_4';
    const newTable = await createTable(tableName);

    const newCol = await customObjectService.createColumn(authorization, {
      table_id: newTable.id,
      name: 'test_col',
      type: 'text',
    });

    const newColName = 'test_col_new';
    const updateCol = await customObjectService.updateColumn(authorization, newCol.id, { name: newColName });
    expect(updateCol.name)
      .toBe(newColName);

    const queryTable = await customObjectService.findTable(authorization, newTable.id);
    expect(queryTable.columns[0].name)
      .toBe(newColName);

    console.info('queryTable', newTable);
    console.info('queryTable', newColName);
  });
});
