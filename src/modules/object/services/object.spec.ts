import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CustomObjectAuthorization, CustomObjectService } from '@/modules/api/customObject.service';
import ObjectService from '@/modules/object/services/object';
import models from '@/models';
import config from '@/config';
import { ApiService } from '@/modules/api/service';
import { CreateObjectColumn } from '@/modules/object/types/object';

describe('apiService', () => {
  let objectService: ObjectService;
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
        TypeOrmModule.forFeature(models),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...config.typeOrm,
          } as TypeOrmModuleAsyncOptions),
        }),
      ],
      controllers: [],
      providers: [ObjectService, ApiService, CustomObjectService],
    })
      .compile();
    module.useLogger(console);
    objectService = module.get<ObjectService>(ObjectService);
    customObjectService = module.get<CustomObjectService>(CustomObjectService);
  });
  const authorization: CustomObjectAuthorization = {
    objectAppId: 'uK9vCDQMJEWNmeKi',
    // eslint-disable-next-line max-len
    userAuthorization: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiSnFIRXNGalc1THpra2diOCIsImNyZWF0ZWRfYXQiOjE2ODY4ODUwMTgsImV4cCI6MTY4NzQ4OTgxOH0.nlnxC_MdjEjSOmRg88QAIRmGu-tAryT8dhOZZG2ODkk',
  };

  const defaultColumns: CreateObjectColumn[] = [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'birthday',
      type: 'date',
    },
    {
      name: 'is_vip',
      type: 'bool',
    },
  ];

  it('findOrCreateObjectApp', async () => {
    const app = await objectService.findOrCreateObjectApp(authorization.userAuthorization, 'test_user_key');
    console.info('app', app);
  });

  it('createTable', async () => {
    const newTable = await objectService.createTable(
      authorization,
      'object_test_table_1',
      defaultColumns,
      true,
    );
    expect(newTable.columns)
      .toHaveLength(4);
  });

  it('checkChangeTableColumns', async () => {
    const newTable = await objectService.createTable(
      authorization,
      'object_test_table_2',
      defaultColumns,
      true,
    );

    const newTableColumns = await objectService.mergeTableColumns(authorization, newTable.tableId, [
      ...defaultColumns,
      {
        name: 'is_del',
        type: 'bool',
      },
    ]);
    expect(newTableColumns.filter((col) => (!ObjectService.defaultColumnNames.includes(col.name))))
      .toHaveLength(5);
  });

  it('checkChangeTableColumnsFailUpdateType', async () => {
    const newTable = await objectService.createTable(
      authorization,
      'object_test_table_2',
      defaultColumns,
      true,
    );

    const t = async () => objectService.mergeTableColumns(authorization, newTable.tableId, [
      ...defaultColumns,
      {
        name: 'is_vip',
        type: 'string',
      },
    ]);
    await expect(t)
      .rejects
      .toThrowError(/is_vip.*无法转化/);
  });

  it('updateTableColumn', async () => {
    let newTable = await objectService.createTable(
      authorization,
      'object_test_table_3',
      defaultColumns,
      true,
    );

    const newTableColumns = await objectService.mergeTableColumns(authorization, newTable.tableId, [
      ...defaultColumns,
      {
        name: 'is_del',
        type: 'bool',
      },
    ]);

    newTable = await objectService.updateTableColumns(
      authorization,
      newTable.tableId,
      newTableColumns,
    );
    expect(newTable.columns.filter((col) => (!ObjectService.defaultColumnNames.includes(col.name))))
      .toHaveLength(5);

    const currentTable = await customObjectService.findTable(authorization, newTable.tableId);

    expect(currentTable.columns.filter((col) => (!ObjectService.defaultColumnNames.includes(col.name))))
      .toHaveLength(5);
  });
});
