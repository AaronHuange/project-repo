import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  InsertFormPermission,
  SelectPermissionParams,
  FormPermissions,
} from './permissionType';
import { getUuid } from '@/utils/uuid';
import { THttpSuccessResponse } from '@/interfaces/response.interface';
import { FormPermission } from '@/models/form_permission.model';
import { ICloudUserInfo } from '@/modules/api/type';

@Injectable()
export default class FormPermissionService {
  constructor(
    @InjectRepository(FormPermission)
    private readonly formPermissionRepository: Repository<FormPermission>,
  ) {}

  async select(
    params: SelectPermissionParams,
  ): Promise<THttpSuccessResponse<Array<FormPermission>>> {
    const pageSize = params.pageSize || 10;
    const page = params.page || 1;

    const where:
      | FindOptionsWhere<FormPermission>[]
      | FindOptionsWhere<FormPermission> = {};
    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.formId) {
      where.formId = params.formId;
    }
    if (params.formDataTableName) {
      where.formDataTableName = params.formDataTableName;
    }
    const res = await this.formPermissionRepository.find({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    return {
      data: {
        list: res,
        total: res.length,
      },
      success: true,
    };
  }

  async insert(
    userInfo: ICloudUserInfo,
    params: InsertFormPermission,
  ): Promise<THttpSuccessResponse<FormPermission>> {
    // 获取当前用户信息
    const value: FormPermissions = {
      id: getUuid(),
      ...params,
      ownerId: userInfo.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await this.formPermissionRepository.save([value]);
    return {
      data: res[0],
      success: true,
    };
  }
}
