import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import FormPermissionController from './permission';
// import { getJestToken } from '@/utils/jestToken';
import FormPermissionService from '../services/permission';
import { ApiService } from '@/modules/api/service';
import models from '@/models';
import config from '@/config';
import { InsertFormPermission } from '@/modules/permission/services/permissionType';
import { ICloudUserInfo } from '@/modules/api/type';

// const token = getJestToken();

describe('apiService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let formController: FormPermissionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forFeature(models),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...config.typeOrm,
          } as TypeOrmModuleAsyncOptions),
        }),
        WinstonModule.forRootAsync({
          useFactory: () => ({
            // options
          }),
          inject: [],
        }),
      ],
      controllers: [FormPermissionController],
      providers: [FormPermissionService, ApiService],
    })
      .compile();
    formController = module.get<FormPermissionController>(FormPermissionController);
  });

  it('addFormPermission', async () => {
    const userInfo = {
      id: '1',
      name: '1',
      uid: '1',
    } as ICloudUserInfo;
    const createParams = {
      dataPermissions: ['view', 'create'],
      userId: 'xxxx6',
      formId: 'ddd',
      deadline: new Date(),
      type: 'form',
    } as InsertFormPermission;
    const res = await formController.addFormPermission(userInfo, 'ddd', createParams);
    expect(res.success)
      .toBeTruthy();
  });
});
