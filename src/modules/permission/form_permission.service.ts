import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets, Equal, Repository,
} from 'typeorm';
import { FormPermissionPage } from './form_permission.dto';
import { ICloudUserInfo } from '../api/type';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { FormPermission } from '@/models/form_permission.model';
import { getUuid } from '@/utils/uuid';
import { UpdateFormPermissionInput } from './inputs/update_form_permission.input';
import { AddFormPermissionInput } from './inputs/add_form_permission.input';
import { ProjectException } from '@/exceptions/project.error';
import { ANONYMOUSE_ERROR, DEFAULT_ERROR, PARAMS_MISS } from '@/constants/error/general.constant';
import { ApiService } from '@/modules/api/service';
import {
  DeleteFormPermissionInput,
} from '@/modules/permission/inputs/delete_form_permission.input';
import { Form } from '@/models/form.model';

@Injectable()
export class FormPermissionService {
  constructor(
    @InjectRepository(FormPermission)
    private readonly formPermissionRepository: Repository<FormPermission>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly apiService: ApiService,
  ) {
  }

  async queryFormPermission({
                              pagination = {
                                page: 1,
                                pageSize: 25,
                              },
                              filter = null,
                            }: {
    pagination?: PaginationInput,
    filter?: Brackets,
  }): Promise<FormPermissionPage> {
    const queryBuilder = this.formPermissionRepository.createQueryBuilder('f');
    if (filter) {
      queryBuilder.where(filter);
    }
    const formPermissions = await queryBuilder
      .skip((pagination.page - 1) * pagination.pageSize)
      .take(pagination.pageSize)
      .getMany();
    const count = await queryBuilder.getCount();
    return new FormPermissionPage(formPermissions, count, pagination);
  }

  async addFormPermission(
    user: ICloudUserInfo,
    addFormPermissionInput: AddFormPermissionInput,
  ): Promise<Array<FormPermission>> {
    const {
      deadline,
      phones,
    } = addFormPermissionInput;
    if (!deadline || !phones) {
      throw new ProjectException(PARAMS_MISS);
    }
    let users = await this.apiService.findUserByMobiles(phones);
    if (!users) throw new ProjectException(DEFAULT_ERROR);
    users = users.filter((u) => u.id !== user.id);
    const permissionArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const u of users) {
      const { id: userId } = u;
      // eslint-disable-next-line no-await-in-loop
      let currentFormPermission = await this.formPermissionRepository.findOneBy({
        userId,
        formId: addFormPermissionInput.formId,
      });
      if (!currentFormPermission) {
        currentFormPermission = new FormPermission();
        this.formPermissionRepository.merge(currentFormPermission, {
          id: getUuid(),
          userId,
          formId: addFormPermissionInput.formId,
        });
      }
      this.formPermissionRepository.merge(currentFormPermission, {
        formDataTableName: '',
        ...addFormPermissionInput,
      });
      permissionArray.push(currentFormPermission);
    }

    return this.formPermissionRepository.save(permissionArray);
  }

  async updateFormPermission(
    user: ICloudUserInfo,
    formPermission: UpdateFormPermissionInput,
  ): Promise<FormPermission> {
    await this.formPermissionRepository.update(
      {
        id: formPermission.id,
      },
      formPermission,
    );
    return this.formPermissionRepository.findOne({
      where: { id: formPermission.id },
    });
  }

  async checkPermission({
                          user,
                          formId,
                          permission = 'edit',
                          type = 'form',
                          throwCatch = true,
                        }: {
    user: ICloudUserInfo;
    formId: string;
    throwCatch?: boolean;
    permission?: 'edit' | 'view';
    type: 'form' | 'data';
  }): Promise<Boolean> {
    const query = this.formPermissionRepository.createQueryBuilder('p');
    query.andWhere({
      userId: Equal(user.id),
      formId: Equal(formId),
    });
    let fieldName: string;
    if (type === 'form') {
      fieldName = 'p.form_permissions';
    } else {
      fieldName = 'p.data_permissions';
    }
    if (permission === 'edit') {
      query.andWhere(`JSON_SEARCH(${fieldName}, 'one', 'edit') is not null`);
    }
    if (permission === 'view') {
      query.andWhere(`${fieldName} is not null`);
    }
    const count = await query.getCount();
    if (throwCatch && count <= 0) {
      throw new ProjectException(ANONYMOUSE_ERROR);
    }
    return count > 0;
  }

  async deleteFormPermission(user, deleteFormPermissionInput: DeleteFormPermissionInput) {
    const forms = await this.formRepository.findOne({
      where: {
        ownerId: user.id,
        id: deleteFormPermissionInput.formId,
      },
      select: ['id'],
    });
    if (!forms) {
      return null;
    }
    const formPermission = await this.formPermissionRepository.findOneBy({
      id: deleteFormPermissionInput.id,
      formId: deleteFormPermissionInput.formId,
    });
    await formPermission.remove();
    return formPermission;
  }
}
