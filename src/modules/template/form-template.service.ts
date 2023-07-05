import { Injectable } from '@nestjs/common';
import {
  Brackets, IsNull, Not, Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICloudUserInfo } from '@/modules/api/type';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { ProjectException } from '@/exceptions/project.error';
import {
  DATA_MISS,
  DATA_NO_AFFECTED,
} from '@/constants/error/general.constant';
import { usePageResult } from '@/modules/common/utils';
import { getUuid } from '@/utils/uuid';
import { FormTemplate } from '@/models/form_template.model';
import {
  CreateFormTemplateInputType,
  UpdateFormTemplateInputType,
} from '@/modules/template/inputs/form-template.input';
import { FormTemplatePage } from '@/modules/template/form-template.page.dto';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class FormTemplateService {
  constructor(
    @InjectRepository(FormTemplate)
    private readonly formTemplateRepository: Repository<FormTemplate>,
  ) {
  }

  async create(
    user: ICloudUserInfo,
    input: CreateFormTemplateInputType,
  ): Promise<FormTemplate> {
    const formTemplateEntity = new FormTemplate();
    const newFormTemplate = this.formTemplateRepository.merge(
      formTemplateEntity,
      input,
      {
        id: getUuid(),
        ownerId: user.id,
      },
    );
    return this.formTemplateRepository.save(newFormTemplate);
  }

  async update(
    user: ICloudUserInfo,
    input: UpdateFormTemplateInputType,
    filter: Brackets,
  ): Promise<FormTemplate> {
    // todo permission
    const formTemplateEntity = await this.formTemplateRepository
      .createQueryBuilder('t')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
          });
      })
      .limit(1)
      .withDeleted()
      .getOne();
    if (!formTemplateEntity) {
      throw new ProjectException(DATA_MISS);
    }
    return this.formTemplateRepository.save({
      ...formTemplateEntity,
      ...input,
    });
  }

  async destroy(user: ICloudUserInfo, filter: Brackets): Promise<FormTemplate> {
    // todo permission
    const formTemplateEntity = await this.formTemplateRepository
      .createQueryBuilder('t')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
          });
      })
      .withDeleted()
      .limit(1)
      .getOne();
    if (!formTemplateEntity) {
      throw new ProjectException(DATA_MISS);
    }
    const result = await this.formTemplateRepository.delete(
      formTemplateEntity.id,
    );
    if (result.affected > 0) {
      return formTemplateEntity;
    }
    throw new ProjectException(DATA_NO_AFFECTED);
  }

  public async query(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
  ): Promise<FormTemplatePage> {
    // todo permission
    const queryBuilder = this.formTemplateRepository
      .createQueryBuilder('t')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere([
            {
              ownerId: UserService.findOwnerOperator(user.id),
            },
            {
              public: true,
            },
          ]);
      });
    const [formTemplates, count] = await usePageResult<FormTemplate>(
      pagination,
      queryBuilder,
    );
    return new FormTemplatePage(formTemplates, count, pagination);
  }

  public async queryTrash(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
  ): Promise<FormTemplatePage> {
    // todo permission
    const queryBuilder = this.formTemplateRepository
      .createQueryBuilder('t')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
            deletedAt: Not(IsNull()),
          });
      })
      .withDeleted();
    const [formTemplates, count] = await usePageResult<FormTemplate>(
      pagination,
      queryBuilder,
    );
    return new FormTemplatePage(formTemplates, count, pagination);
  }
}
