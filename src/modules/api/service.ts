// eslint-disable-next-line max-classes-per-file
import { Injectable, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  firstValueFrom,
  Observable,
  ObservableInput,
} from 'rxjs';
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';
import { config } from 'dotenv';
import {
  GQLResponse,
  THttpSuccessSingleResponse,
} from '@/interfaces/response.interface';
import { ApiGraphqError, ICloudUserInfo, ObjectAppPlatform } from './type';

config();

const {
  PLATFORM_URL,
} = process.env;

interface ObjectAppResponse {
  client: {
    app?: ObjectAppPlatform;
  };
}

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(
    private http: HttpService,
  ) {
  }

  async getUserInfo(
    token: string,
  ): Promise<THttpSuccessSingleResponse<ICloudUserInfo>> {
    const url = `${PLATFORM_URL}/account/api/v1/auth/signed`;
    const httpOption = ApiService.platformRequestConfig(token);
    const res = await firstValueFrom(
      this.doApi('get', url, null, httpOption),
    );
    return res.data;
  }

  functionUNeed(func, mobiles) {
    return mobiles.map((mobile) => func.call(this, mobile));
  }

  async findUserByMobile(mobile: string): Promise<ICloudUserInfo | null> {
    const url = `${PLATFORM_URL}/account/api/v1/users`;
    return firstValueFrom(
      this.doApi(
        'post',
        url,
        {
          mobile,
        },
        ApiService.platformRequestConfig(),
      )
        .pipe(
          map((resp) => {
            if (resp.data?.success && resp.data.data) {
              return resp.data.data;
            }
            if (!resp.data?.success && resp.data.message) {
              throw new Error(resp.data.message);
            }
            return null;
          }),
        ),
    );
  }

  doApi<T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig,
  ) {
    let httpServiceObservable: Observable<AxiosResponse<T>>;
    // eslint-disable-next-line default-case
    switch (method) {
      case 'get':
      case 'delete':
        httpServiceObservable = this.http[method](url, requestConfig);
        break;
      case 'post':
      case 'patch':
        httpServiceObservable = this.http[method](url, data, requestConfig);
        break;
    }
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`http ${method} ${url} ${JSON.stringify(data)} ${JSON.stringify(requestConfig)}`);
    }
    return httpServiceObservable.pipe(
      catchError(this.httpCatchError.bind(this)),
    );
  }

  async findUser(id: string): Promise<ICloudUserInfo | null> {
    const url = `${PLATFORM_URL}/account/api/v1/users/${id}`;
    return firstValueFrom(
      this.doApi('get', url, null, ApiService.platformRequestConfig())
        .pipe(
          map((resp) => {
            if (resp.data?.success && resp.data.data) {
              return resp.data.data;
            }
            if (!resp.data?.success && resp.data.message) {
              throw new Error(resp.data.message);
            }
            return null;
          }),
        ),
    );
  }

  // FIXME 能直接通过接口查询多个？
  findUserByMobiles(mobiles: Array<string>): Promise<Array<ICloudUserInfo> | null> {
    return new Promise((resolve, reject) => {
      const func = this.functionUNeed(this.findUserByMobile, mobiles);
      Promise.all(func)
        .then((values) => resolve(values))
        .catch((e) => reject(e));
    });
  }

  async findUserByUserId(userId: string): Promise<ICloudUserInfo | null> {
    const url = `${PLATFORM_URL}/account/api/v1/users/${userId}`;
    const res = await firstValueFrom(
      this.doApi('get', url, null, ApiService.platformRequestConfig()),
    );
    // @ts-ignore
    return res.data?.data;
  }

  async createObjectApp(authorization: string, name: string = 'form'): Promise<ObjectAppPlatform> {
    const url = `${PLATFORM_URL}/custom-object/api/graphql`;
    const obs = this.doApi<GQLResponse<ObjectAppResponse>>('post', url, {
      query: `mutation createApp($input:AppInput!){
          createApp(input:$input){
            id
            name
            serviceApiKey
            createdAt
          }
        }`,
      variables: {
        input: {
          name,
          description: 'form service create',
        },
      },
    }, ApiService.platformRequestConfig(authorization, 'authorization'))
      .pipe(
        map((resp) => {
          if (!resp.data) {
            throw ApiService.createPaaSServerBusyError();
          }
          if (resp.data.errors?.length) {
            throw new ApiGraphqError(resp.data.errors);
          }
          if (resp.data.data?.createApp) {
            return resp.data.data.createApp;
          }
          return null;
        }),
      );
    return firstValueFrom(obs);
  }

  async findObjectApps(authorization: string): Promise<ObjectAppPlatform[]> {
    const url = `${PLATFORM_URL}/custom-object/api/graphql`;
    const obs = this.doApi<GQLResponse<ObjectAppResponse>>('post', url, {
      query: `{
          apps{
            id
            name
            serviceApiKey
            createdAt
          }
        }`,
    }, ApiService.platformRequestConfig(authorization, 'authorization'))
      .pipe(
        map((resp) => {
          if (!resp.data) {
            throw ApiService.createPaaSServerBusyError();
          }
          if (resp.data.errors?.length) {
            throw new ApiGraphqError(resp.data.errors);
          }
          if (resp.data.data?.apps) {
            return resp.data.data.apps;
          }
          return null;
        }),
      );
    return firstValueFrom(obs);
  }

  async getObjectApp(
    userId: string,
    appId: string,
  ): Promise<ObjectAppPlatform | null> {
    const url = `${PLATFORM_URL}/custom-object/api/graphql`;
    const obs = this.doApi<GQLResponse<ObjectAppResponse>>(
      'post',
      url,
      {
        query: `query getApp($userId:String!,$appId:String!){
          client{
            app(userId:$userId,appId:$appId){
              id
              name
              serviceApiKey
              createdAt
            }
          } 
        }`,
        variables: {
          userId,
          appId,
        },
      },
      ApiService.platformRequestConfig(),
    )
      .pipe(
        map((resp) => {
          if (!resp.data) {
            throw ApiService.createPaaSServerBusyError();
          }
          if (resp.data.errors?.length) {
            throw new ApiGraphqError(resp.data.errors);
          }
          if (resp.data.data?.client.app) {
            return resp.data.data.client.app;
          }
          return null;
        }),
      );
    return firstValueFrom(obs);
  }

  async requestGraphql(
    body: {
      query: string;
      variables?: { value?: any };
      other: {
        table?: string;
        type?: 'select' | 'delete' | 'insert' | 'update';
        where?: {
          [key: string]: any;
        };
      };
    },
    headers: any,
  ) {
    const url = `${process.env.CUSTOM_OBJECT_GATEWAY_URL}/graphql`;
    // headers['Authorization'] =
    // eslint-disable-next-line max-len
    //   'eyJhbGciOiJIUzI1NiJ9.eyJhcHBVaWQiOiJyNllUVFRlZUpuSmljNUhTIiwicm9sZU5hbWUiOiJzZXJ2aWNlX3JvbGUiLCJzY2hlbWFzIjpbInB1YmxpYyJdLCJjcmVhdGVkQXQiOjE2ODYyOTM4OTAsImV4cGlyZWRBdCI6MjAwMTY1Mzg5MH0.f5Zs77ZNOKnDlwoacSGLxMOF6iwT_CLfMuSVI478L5g';
    // 暂时先删除 访问test PG库

    const params = body;
    delete params.other;
    const res = await firstValueFrom(
      this.doApi('post', url, params, { headers }),
    );
    return res.data;
  }

  static platformRequestConfig(authToken?: string, authType?: 'authorization' | 'authToken'): AxiosRequestConfig {
    const headers: RawAxiosRequestHeaders = {
      'content-type': 'application/json',
      'x-lxcloud-app': process.env.PLATFORM_CLIENT_KEY,
    };
    if (authToken) {
      const token = authToken.startsWith('Bearer ')
        ? authToken.slice(7)
        : authToken;
      if (authType && authType === 'authorization') {
        headers.authorization = `Bearer ${token}`;
      } else {
        headers['x-lxcloud-auth-token'] = token;
        headers['x-lxcloud-access-token'] = process.env.PLATFORM_CLIENT_TOKEN;
      }
    } else {
      headers['x-lxcloud-access-token'] = process.env.PLATFORM_CLIENT_TOKEN;
    }
    return {
      headers,
    };
  }

  static createPaaSServerBusyError() {
    return new Error('PaaS服务繁忙,请稍后重试');
  }

  private httpCatchError(err: AxiosError): ObservableInput<any> {
    // eslint-disable-next-line no-underscore-dangle
    this.logger.warn(`ApiService ${err.request?._currentUrl} err  ${err.message}`, err.response?.data);
    this.logger.debug(err);
    throw ApiService.createPaaSServerBusyError();
  }
}
