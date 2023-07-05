import { Injectable } from '@nestjs/common';
import {
  Brackets,
  DataSource,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '@/models/form.model';
import {
  CreateFormInputType,
  UpdateFormInputType,
} from '@/modules/form/inputs/form.input';
import { ICloudUserInfo } from '@/modules/api/type';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { FormPage } from '@/modules/form/form.page.dto';
import { FormPermissionService } from '../permission/form_permission.service';
import { ProjectException } from '@/exceptions/project.error';
import { BAD_USER_INPUT, DATA_MISS, DATA_NO_AFFECTED } from '@/constants/error/general.constant';
import { usePageResult } from '@/modules/common/utils';
import { FormStatusEnum } from '@/models/base/interfaces';
import { FormPermission } from '@/models/form_permission.model';
import { getUuid } from '@/utils/uuid';
import { FormStore } from '@/models/form_store.model';
import ObjectService from '@/modules/object/services/object';
import { CreateObjectColumn, ObjectTable } from '@/modules/object/types/object';
import { OrderByInput } from '@/graphql/filter/orderby.input';
import { ApiService } from '@/modules/api/service';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormPermission)
    private readonly formPermissionRepository: Repository<FormPermission>,
    @InjectRepository(FormStore)
    private readonly formStoreRepository: Repository<FormStore>,
    private readonly objectService: ObjectService,
    private readonly formPermissionService: FormPermissionService,
    private readonly apiService: ApiService,
    private dataSource: DataSource,
  ) {
  }

  STATUS_FLOW = {
    draft: [FormStatusEnum.published, FormStatusEnum.trashed],
    published: [FormStatusEnum.draft],
    trashed: [FormStatusEnum.draft],
  };

  checkChangeToStatus(
    saveStatus: FormStatusEnum,
    updateStatus: FormStatusEnum,
  ) {
    if (saveStatus === updateStatus) return true;
    return saveStatus && this.STATUS_FLOW[saveStatus].includes(updateStatus);
  }

  async create(user: ICloudUserInfo, form: CreateFormInputType): Promise<Form> {
    let newForm = this.formRepository.create();
    newForm = this.formRepository.merge(newForm, form, {
      id: getUuid(),
      ownerId: user.id,
    });
    newForm = await newForm.save();
    return newForm;
  }

  async update(
    user: ICloudUserInfo,
    form: UpdateFormInputType,
    filter: Brackets,
  ): Promise<Form> {
    const formEntity = await this.formRepository
      .createQueryBuilder('f')
      .where((qb) => {
        qb.andWhere(filter);
      })
      .limit(1)
      .withDeleted()
      .getOne();
    if (!formEntity) {
      throw new ProjectException(DATA_MISS);
    }
    if (formEntity.ownerId !== user.id) {
      await this.formPermissionService.checkPermission({
        user,
        formId: formEntity.id,
        type: 'form',
      });
    }
    const oldStatus = formEntity.status;
    const modifyForm = this.formRepository.merge(formEntity, form);
    if (!this.checkChangeToStatus(oldStatus, modifyForm.status)) {
      throw new ProjectException(
        BAD_USER_INPUT(
          `表单状态${oldStatus}不能更改成${modifyForm.status}`,
        ),
      );
    } else if (modifyForm.status === FormStatusEnum.trashed) {
      modifyForm.deletedAt = new Date();
    } else {
      modifyForm.deletedAt = null;
    }
    return this.formRepository.save(modifyForm);
  }

  async destroy(user: ICloudUserInfo, filter: Brackets): Promise<Form> {
    const formEntity = await this.formRepository
      .createQueryBuilder('f')
      .where((qb) => {
        qb.andWhere(filter);
      })
      .withDeleted()
      .limit(1)
      .getOne();
    if (!formEntity) {
      throw new ProjectException(DATA_MISS);
    }
    if (formEntity.ownerId !== user.id) {
      await this.formPermissionService.checkPermission({
        user,
        formId: formEntity.id,
        type: 'form',
      });
    }
    const result = await this.formRepository.delete(formEntity.id);
    if (result.affected > 0) {
      return formEntity;
    }
    throw new ProjectException(DATA_NO_AFFECTED);
  }

  public async findPublishForm(
    formId: string,
  ): Promise<Form> {
    return this.formRepository.findOneBy({
      id: formId,
      status: FormStatusEnum.published,
      publishedAt: Not(IsNull()),
    });
  }

  public async query(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
    orderBy: OrderByInput,
  ): Promise<FormPage> {
    const formQuery = this.formRepository
      .createQueryBuilder('f')
      .andWhere(filter);
    formQuery.andWhere(new Brackets((qb) => {
      const subQuery = formQuery.subQuery()
        .from(FormPermission, 'p')
        .select('p.formId')
        .where({
          userId: user.id,
          formPermissions: Not(IsNull()),
        })
        .getQuery();
      qb.andWhere(`f.id IN ${subQuery}`);
      qb.orWhere('f.owner_id = :userId', { userId: user.id });
    }));
    if (!orderBy?.orderByDesc && !orderBy?.orderByAsc) {
      formQuery.orderBy('f.createdAt', 'DESC');
    }
    if (orderBy?.orderByDesc) {
      formQuery.orderBy(`f.${orderBy.orderByDesc!!}`, 'DESC');
    }
    if (orderBy?.orderByAsc) {
      formQuery.orderBy(`f.${orderBy.orderByAsc!!}`, 'ASC');
    }
    const [forms, count] = await usePageResult<Form>(pagination, formQuery);
    return new FormPage(forms, count, pagination);
  }

  public async queryTrash(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
    orderBy: OrderByInput,
  ): Promise<FormPage> {
    const formQuery = this.formRepository
      .createQueryBuilder('f')
      .andWhere(filter)
      .andWhere('(f.owner_id = :userId AND f.deleted_at IS NOT NULL)', { userId: user.id })
      .withDeleted();
    if (!orderBy?.orderByDesc && !orderBy?.orderByAsc) {
      formQuery.orderBy('f.createdAt', 'DESC');
    }
    if (orderBy?.orderByDesc) {
      formQuery.orderBy(`f.${orderBy.orderByDesc!!}`, 'DESC');
    }
    if (orderBy?.orderByAsc) {
      formQuery.orderBy(`f.${orderBy.orderByAsc!!}`, 'ASC');
    }
    const [forms, count] = await usePageResult<Form>(pagination, formQuery);
    return new FormPage(forms, count, pagination);
  }

  /*
  TODO 只能同步自己的自定义对象
   */
  private async syncCustomObjectFrom(user: ICloudUserInfo, form: Form, columns: CreateObjectColumn[]) {
    if (!columns) {
      return null;
    }
    // TODO 缺少 字段抽离函数
    const app = await this.objectService.findOrCreateObjectApp(user.authorization, user.id);
    const customObjectAuthorization = ObjectService.createCustomObjectAuthorization(user, app.objectAppId);
    const formStore = await this.formStoreRepository.findOneBy({ formId: form.id });
    let newFormStore: FormStore | null = formStore;
    let objectTable: ObjectTable;
    const tableName = FormService.makeObjectTableName();
    if (formStore) {
      const newColumns = await this.objectService.mergeTableColumns(
        customObjectAuthorization,
        formStore.tableId,
        columns,
      );
      objectTable = await this.objectService.updateTableColumns(
        customObjectAuthorization,
        formStore.tableId,
        newColumns,
      );
    } else {
      objectTable = await this.objectService.createTable(
        customObjectAuthorization,
        tableName,
        columns,
      );
    }
    if (!newFormStore) {
      newFormStore = this.formStoreRepository.create();
      newFormStore.id = getUuid();
      newFormStore.formId = form.id;
      newFormStore.tableName = tableName;
    }
    newFormStore.objectAppId = app.objectAppId;
    newFormStore.tableId = objectTable.tableId;
    newFormStore.columnsMeta = objectTable.columns;
    await newFormStore.save();
    return objectTable.columns;
  }

  static makeObjectTableName() {
    const unix = (new Date().getTime()).toString();
    const randNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, '0');
    return `form_data_${unix}${randNum}`;
  }

  async publish(user:ICloudUserInfo, formId: string) {
    return this.dataSource.transaction(async (manager) => {
      let form = await this.formRepository.findOneBy({
        id: formId,
      });
      // 如果发布的不是自己发布的表单，检查权限
      if (form.ownerId !== user.id) {
        await this.formPermissionService.checkPermission({
          user, formId, permission: 'edit', type: 'form', throwCatch: true,
        });
      }
      if (!form) throw new Error('报表未找到');
      if (form.status !== FormStatusEnum.published) form.status = FormStatusEnum.published;
      form.publishedAt = new Date();
      form.publishColumns = form.columns;
      form.publishJsonField = form.jsonField;
      form = await manager.save(Form, form);
      const columns = form.publishColumns as CreateObjectColumn[];
      if (columns && columns.length) {
        await this.syncCustomObjectFrom(user, form, columns);
      }
      return form;
    });
  }
}
