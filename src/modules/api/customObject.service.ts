// eslint-disable-next-line max-classes-per-file
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AxiosError, AxiosResponse, RawAxiosRequestHeaders, AxiosRequestConfig,
} from 'axios';
import { config } from 'dotenv';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, Observable, ObservableInput } from 'rxjs';
import {
  Column, CreateColumn, CreateTable, Table, UpdateColumn,
} from '@/modules/api/type';

config();

export interface CustomObjectAuthorization {
  userAuthorization: string,
  objectAppId: string,
}

export class CustomObjectError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message?: string) {
    super(message);
  }
}

@Injectable()
export class CustomObjectService {
  private readonly logger = new Logger(CustomObjectService.name);

  private customObjectServiceUrl: string;

  private customObjectAppKey: string;

  constructor(private httpService: HttpService) {
    this.customObjectServiceUrl = `${process.env.CUSTOM_OBJECT_MATE_URL}`;
    this.customObjectAppKey = '';
  }

  async createTable(authorization: CustomObjectAuthorization, createTable: CreateTable): Promise<Table> {
    if (!createTable.schema) {
      // eslint-disable-next-line no-param-reassign
      createTable.schema = 'public';
    }
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/tables`;
    return this.doApi<Table>(authorization, 'post', url, createTable);
  }

  async deleteTable(authorization: CustomObjectAuthorization, tableId: number): Promise<Table> {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/tables/${tableId}`;
    return this.doApi<Table>(authorization, 'delete', url);
  }

  async findTable(authorization: CustomObjectAuthorization, tableId: number): Promise<Table> {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/tables/${tableId}`;
    return this.doApi<Table>(authorization, 'get', url);
  }

  async tables(authorization: CustomObjectAuthorization): Promise<Table[]> {
    // eslint-disable-next-line max-len
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/tables?included_schemas=public&include_columns=false`;

    return this.doApi<Table[]>(authorization, 'get', url);
  }

  async columns(authorization: CustomObjectAuthorization): Promise<Column[]> {
    // eslint-disable-next-line max-len
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/columns?included_schemas=public&include_columns=false`;
    return this.doApi<Column[]>(authorization, 'get', url);
  }

  async createColumn(
    authorization: CustomObjectAuthorization,
    createColumn: CreateColumn,
  ): Promise<Column> {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/columns`;
    return this.doApi<Column>(authorization, 'post', url, createColumn);
  }

  async updateColumn(
    authorization: CustomObjectAuthorization,
    columnId: string,
    updateColumn: UpdateColumn,
  ): Promise<Column> {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/columns/${columnId}`;
    return this.doApi<Column>(authorization, 'patch', url, updateColumn);
  }

  async deleteColumn(
    authorization: CustomObjectAuthorization,
    columnId: string,
  ): Promise<Column> {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/columns/${columnId}`;
    return this.doApi<Column>(authorization, 'delete', url);
  }

  async query<T = unknown>(
    authorization: CustomObjectAuthorization,
    querySql: string,
  ) {
    const url = `${this.customObjectServiceUrl}/app/${authorization.objectAppId}/query`;
    return this.doApi<T>(authorization, 'post', url, { query: querySql });
  }

  private static httpHeaders(authorization: string): RawAxiosRequestHeaders {
    let newAuthorization = authorization;
    if (!newAuthorization.startsWith('Bearer ')) {
      newAuthorization = `Bearer ${newAuthorization}`;
    }
    return {
      Authorization: newAuthorization,
      'content-type': 'application/json',
    };
  }

  httpCatchError(err: AxiosError): ObservableInput<any> {
    // eslint-disable-next-line no-underscore-dangle
    this.logger.warn(`CustomObjectService err ${err.request?._currentUrl} ${err?.message}`);
    if ((err.response.data as any)?.error) {
      throw new CustomObjectError((err.response.data as any).error);
    }
    throw CustomObjectService.createPaaSServerBusyError();
  }

  doApi<T>(
    authorization: CustomObjectAuthorization,
    method: 'get' | 'post' | 'patch' | 'delete',
    url: string,
    data?: any,
  ) {
    let httpServiceObservable: Observable<AxiosResponse<T>>;
    const requestConfig: AxiosRequestConfig = {
      headers: CustomObjectService.httpHeaders(authorization.userAuthorization),
    };
    // eslint-disable-next-line default-case
    switch (method) {
      case 'get':
      case 'delete':
        httpServiceObservable = this.httpService[method](url, requestConfig);
        break;
      case 'post':
      case 'patch':
        httpServiceObservable = this.httpService[method](url, data, requestConfig);
        break;
    }
    return this.httpObservable<T>(httpServiceObservable);
  }

  httpObservable<T>(httpAxiosObservable: Observable<AxiosResponse<T>>): Promise<T> {
    return firstValueFrom(
      httpAxiosObservable.pipe(
        catchError(this.httpCatchError.bind(this)),
        map((resp) => resp.data),
      ),
    );
  }

  static createPaaSServerBusyError() {
    return new Error('PaaS服务繁忙,请稍后重试');
  }
}
