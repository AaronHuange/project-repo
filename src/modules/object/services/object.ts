import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { pg } from 'sqlutils';
import * as camelcase from 'lodash.camelcase';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiService } from '@/modules/api/service';
import { CustomObjectAuthorization, CustomObjectService } from '@/modules/api/customObject.service';
import { CreateObjectColumn, ObjectColumnType, ObjectTable } from '@/modules/object/types/object';
import { CreateColumn, ICloudUserInfo, Table } from '@/modules/api/type';
import { App } from '@/models/app.model';
import { getUuid } from '@/utils/uuid';
import { FormPermission } from '@/models/form_permission.model';
import { Form } from '@/models/form.model';

@Injectable()
export default class ObjectService {
  static defaultColumn: CreateColumn[] = [
    {
      table_id: -1,
      name: 'id',
      type: 'int8',
      is_identity: true,
      is_primary_key: true,
    },
    {
      table_id: -1,
      name: 'created_at',
      type: 'timestamptz',
      is_nullable: true,
      default_value: 'now()',
      default_value_format: 'expression',
    },
    {
      table_id: -1,
      name: 'updated_at',
      type: 'timestamptz',
      is_nullable: true,
      default_value: 'now()',
      default_value_format: 'expression',
    },
  ];

  static defaultColumnNames = ObjectService.defaultColumn.map((c) => c.name);

  static defaultColumnNamesCamelcase = ObjectService.defaultColumnNames.map((v) => (camelcase(v)));

  constructor(
    private readonly apiService: ApiService,
    private readonly customObjectService: CustomObjectService,
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
    @InjectRepository(FormPermission)
    private readonly formPermissionRepository: Repository<FormPermission>,
    @InjectRepository(Form) private readonly formRepository: Repository<Form>,
  ) {
  }

  async handle(body: any, headers: any) {
    const header: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    if (body.other?.table?.indexOf('formData') >= 0) {
      let userInfo: ICloudUserInfo;

      if (headers.authorization) {
        try {
          const userRes = await this.apiService.getUserInfo(headers.authorization);
          if (userRes.success) {
            userInfo = userRes.data;
          } else {
            return { errors: [userRes] };
          }
        } catch (e) {
          return { errors: [e] };
        }

        // 查询
      }
      let formId: string;
      let creatorId: string;
      if (body?.other?.type === 'select' || body?.other?.type === 'delete') {
        formId = body?.other?.where?.formId.equalTo;
        creatorId = body?.other?.where?.creatorId?.equalTo;
      } else if (body?.other?.type === 'insert') {
        formId = body?.variables?.input?.formId;
      } else if (body?.other?.type === 'update') {
        formId = body?.other?.where?.formId;
      }
      const noPermission = { errors: [{ message: 'Permission denied' }] };

      if (!userInfo && body?.other?.type !== 'insert') {
        noPermission.errors[0].message = `${noPermission.errors[0].message}, Line: 60`;
        return noPermission;
      }
      const formInfo = await this.formRepository.findOne({
        where: {
          id: formId,
        },
      });
      // 查询pg graphql的授权key
      const app = await this.appRepository.findOneBy({
        userId: formInfo.ownerId,
      });

      if (app?.objectServiceKey) {
        header.Authorization = app.objectServiceKey;
      }

      // form表单创建人不是当前登录用户开始判断权限，登录用户校验权限
      if (userInfo && formInfo.ownerId !== userInfo.id) {
        const permission = await this.formPermissionRepository.findOne({
          where: {
            userId: userInfo.id,
            formId,
          },
        });
        if (
          !permission
          || !permission.dataPermissions
          || permission.dataPermissions?.length === 0
        ) {
          if (!body?.other?.type || (body.other.type !== 'insert' && body.other.type !== 'select')) {
            noPermission.errors[0].message = `${noPermission.errors[0].message}, Line: 90`;
            return noPermission;
          }
        }
        if (
          body?.other?.type === 'select'
          && (!permission?.dataPermissions?.includes('view') && userInfo?.id !== creatorId)
        ) {
          noPermission.errors[0].message = `${noPermission.errors[0].message}, Line: 97`;
          return noPermission;
        }
        if (
          body?.other?.type === 'insert'
          && !permission?.dataPermissions?.includes('create')
        ) {
          noPermission.errors[0].message = `${noPermission.errors[0].message}, Line: 104`;
          return noPermission;
        }
        if (
          body?.other?.type === 'delete'
          && !permission?.dataPermissions?.includes('destroy')
        ) {
          noPermission.errors[0].message = `${noPermission.errors[0].message}, Line: 111`;
          return noPermission;
        }
      }
    }
    return this.apiService.requestGraphql(body, header);
  }

  private async createObjectTable(
    authorization: CustomObjectAuthorization,
    tableName: string,
    force?: boolean,
  ): Promise<Table> {
    let newTable;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newTable = await this.customObjectService.createTable(authorization, {
        name: tableName,
      });
    } catch (e) {
      const { message } = e as Error;
      if (message.toLowerCase()
        .endsWith('already exists') && force) {
        const tableOid = await this.findTableOid(authorization, tableName);
        if (!tableOid) {
          throw new Error('获取表异常');
        }
        await this.customObjectService.deleteTable(authorization, tableOid);
        return this.createObjectTable(authorization, tableName);
      }
      throw e;
    }
    return newTable;
  }

  static createCustomObjectAuthorization(user: ICloudUserInfo, objectAppId: string): CustomObjectAuthorization {
    return {
      userAuthorization: user.authorization,
      objectAppId,
    };
  }

  async findOrCreateObjectApp(authorization: string, userId: string, appName: string = 'form') {
    let app = await this.appRepository.findOneBy({
      userId,
    });
    if (app && app.objectAppId) {
      return app;
    }
    const apps = await this.apiService.findObjectApps(authorization);
    let formApp = apps.find((objectApp) => (objectApp.name === appName));
    // 创建 自定义对象
    if (!formApp) {
      formApp = await this.apiService.createObjectApp(authorization);
    }
    if (!app) {
      app = new App();
      app.id = getUuid();
      app.userId = userId;
    }
    app.objectAppId = formApp.id;
    app.objectServiceKey = formApp.serviceApiKey;
    app = await this.appRepository.save(app);
    return app;
  }

  async findTableOid(
    authorization: CustomObjectAuthorization,
    tableName: string,
    schemaName?: string,
  ) {
    const sql = `select oid, relname
                 from pg_class
                 where relnamespace =
                       (select oid
                        from pg_namespace
                        where nspname = ${pg.escape(schemaName || 'public')}
                        limit 1)
                   AND relname = ${pg.escape(tableName)}
                   and relkind IN ('r', 'p')`;
    const tableIds = await this.customObjectService.query<{
      oid: number,
      relname: string,
    }[]>(authorization, sql);
    if (tableIds && tableIds.length > 0) {
      return tableIds[0].oid;
    }
    return null;
  }

  static filterColumns(columns: CreateObjectColumn[]) {
    return columns.filter((col) => (
      !ObjectService.defaultColumnNamesCamelcase.includes(camelcase(col.name))
    ));
  }

  async createTable(
    authorization: CustomObjectAuthorization,
    tableName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    columns: CreateObjectColumn[],
    force?: boolean,
  ): Promise<ObjectTable> {
    const newTable = await this.createObjectTable(authorization, tableName, force);
    const objectTable: ObjectTable = {
      name: tableName,
      tableId: newTable.id,
      columns: [],
    };
    const newColumns = ObjectService.filterColumns(columns);

    try {
      // create default column
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const k in ObjectService.defaultColumn) {
        // eslint-disable-next-line no-await-in-loop
        await
          this
            .customObjectService
            .createColumn(authorization, {
              ...ObjectService.defaultColumn[k],
              table_id: newTable
                .id,
            });
      }

// eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const k in newColumns) {
        // eslint-disable-next-line no-await-in-loop
        await this.customObjectService.createColumn(authorization, {
          name: newColumns[k].name,
          type: ObjectService.getCustomObjectColumnsType(newColumns[k].type),
          table_id: newTable.id,
        });
        objectTable.columns.push({ ...newColumns[k] });
      }
    } catch
      (e) {
      try {
        await this.customObjectService.deleteTable(authorization, newTable.id);
      } catch (_deleteError) { /* empty */
      }
      throw e;
    }
    return objectTable;
  }

  async mergeTableColumns(
    authorization: CustomObjectAuthorization,
    tableId: number,
    columns: CreateObjectColumn[],
  ) {
    const newTable = await this.customObjectService.findTable(authorization, tableId);
    if (newTable.columns.length === 0) {
      return columns;
    }
    const columnsMap = new Map<string, CreateObjectColumn>(
      newTable.columns.map((col): [string, CreateObjectColumn] => (
        [
          col.name,
          {
            name: col.name,
            type: ObjectService.getColumnTypeByCustomObjectColumnsType(col.format),
          },
        ]
      )),
    );
    if (columns.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const col of columns) {
        if (!columnsMap.has(col.name)) {
          columnsMap.set(col.name, { ...col });
        } else {
          const oldCol = columnsMap.get(col.name);
          if (col.type !== oldCol.type) {
            throw new Error(`${col.name} ${oldCol.type} 无法转化为 ${col.type}`);
          }
        }
      }
    }
    return Array.from(columnsMap.values());
  }

  async updateTableColumns(
    authorization: CustomObjectAuthorization,
    tableId: number,
    columns: CreateObjectColumn[],
  ): Promise<ObjectTable> {
    const newTable = await this.customObjectService.findTable(authorization, tableId);
    const objectTable: ObjectTable = {
      name: newTable.name,
      tableId: newTable.id,
      columns: [],
    };
    const filterColumns = ObjectService.filterColumns(columns)
      .filter((col) => (
        !newTable.columns.find((oldCol) => (oldCol.name === col.name))
      ));
    if (newTable.columns.length > 0) {
      newTable.columns.filter((col) => (!ObjectService.defaultColumnNames.includes(col.name)))
        .forEach((col) => {
          objectTable.columns.push({
            name: col.name,
            type: ObjectService.getColumnTypeByCustomObjectColumnsType(col.format),
          });
        });
    }
    if (filterColumns.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const column of filterColumns) {
        // eslint-disable-next-line no-await-in-loop
        await this.customObjectService.createColumn(authorization, {
          name: column.name,
          type: ObjectService.getCustomObjectColumnsType(column.type),
          table_id: newTable.id,
        });
        objectTable.columns.push({
          name: column.name,
          type: column.type,
        });
      }
    }
    return objectTable;
  }

  static getColumnTypeByCustomObjectColumnsType(type: string):
    ObjectColumnType {
    switch (type) {
      case 'text':
        return 'string';
      case 'int8':
        return 'number';
      case 'bool':
        return 'bool';
      case 'jsonb':
        return 'json';
      case 'timestamptz':
        return 'date';
      default:
        throw new Error(`无效的自定义类型: ${type}`);
    }
  }

  static getCustomObjectColumnsType(columnType: ObjectColumnType): string {
    switch (columnType) {
      case 'string':
        return 'text';
      case 'number':
        return 'int8';
      case 'bool':
        return 'bool';
      case 'date':
        return 'timestamptz';
      case 'json':
        return 'jsonb';
      default:
        throw new Error(`无效的自定义类型: ${columnType}`);
    }
  }
}
