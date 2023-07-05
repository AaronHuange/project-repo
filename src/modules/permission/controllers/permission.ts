import {
  Body, Controller, Get, Param, Post, Query, UseGuards,
} from '@nestjs/common';
import FormPermissionService from '../services/permission';
import { InsertFormPermission, SelectPermissionParams } from '../services/permissionType';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { User } from '@/filters/user.decorator';

@UseGuards(PaaSAuthGuard)
@Controller('permission')
export default class FormPermissionController {
  constructor(private readonly service: FormPermissionService) {}

  @Get('form/:formId')
  async getFormPermission(
    @User() userInfo,
    @Param('formId') formId: string,
    @Query() params: SelectPermissionParams,
  ) {
    const reqParams: SelectPermissionParams = params || {};
    reqParams.formId = formId;
    const res = await this.service.select(reqParams);
    return res;
  }

  @Post('form/:formId')
  async addFormPermission(
    @User() userInfo,
    @Param('formId') formId: string,
    @Body() params: InsertFormPermission,
  ) {
    // eslint-disable-next-line no-param-reassign
    params.formId = formId;
    return this.service.insert(userInfo, params);
  }
}
