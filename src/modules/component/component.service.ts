import { Injectable } from '@nestjs/common';
import {
  Brackets, IsNull, Not, Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { uuid } from 'uuidv4';
import { Component } from '@/models/component.model';
import {
  CreateComponentInputType,
  UpdateComponentInputType,
} from './inputs/component.input';
import { ProjectException } from '@/exceptions/project.error';
import {
  DATA_MISS,
  DATA_NO_AFFECTED,
} from '@/constants/error/general.constant';
import { ICloudUserInfo } from '@/modules/api/type';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { ComponentPage } from '@/modules/component/component.page.dto';
import { usePageResult } from '@/modules/common/utils';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {
  }

  async create(
    user: ICloudUserInfo,
    input: CreateComponentInputType,
  ): Promise<Component> {
    // todo permission
    return this.componentRepository.save({
      id: uuid(),
      ...input,
      useNumber: 0,
      previewNumber: 0,
      ownerId: user.id,
    });
  }

  async update(
    user: ICloudUserInfo,
    input: UpdateComponentInputType,
    filter: Brackets,
  ): Promise<Component> {
    // todo permission
    const componentEntity = await this.componentRepository
      .createQueryBuilder('c')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
          });
      })
      .limit(1)
      .withDeleted()
      .getOne();
    if (!componentEntity) {
      throw new ProjectException(DATA_MISS);
    }
    const modifyComponent = { ...componentEntity, ...input };
    return this.componentRepository.save(modifyComponent);
  }

  public async query(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
  ): Promise<ComponentPage> {
    // todo permission
    const queryBuilder = this.componentRepository
      .createQueryBuilder('c')
      .andWhere(filter)
      .andWhere([{ ownerId: UserService.findOwnerOperator(user.id) }, { public: true }]);
    const [components, count] = await usePageResult<Component>(
      pagination,
      queryBuilder,
    );
    return new ComponentPage(components, count, pagination);
  }

  public async queryTrash(
    user: ICloudUserInfo,
    pagination: PaginationInput,
    filter: Brackets,
  ): Promise<ComponentPage> {
    // todo permission
    const queryBuilder = this.componentRepository
      .createQueryBuilder('c')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
            deletedAt: Not(IsNull()),
          });
      })
      .withDeleted();
    const [components, count] = await usePageResult<Component>(
      pagination,
      queryBuilder,
    );
    return new ComponentPage(components, count, pagination);
  }

  async destroy(user: ICloudUserInfo, filter: Brackets): Promise<Component> {
    // todo permission
    const componentEntity = await this.componentRepository
      .createQueryBuilder('c')
      .where((qb) => {
        qb.andWhere(filter)
          .andWhere({
            ownerId: UserService.findOwnerOperator(user.id),
          });
      })
      .withDeleted()
      .limit(1)
      .getOne();
    if (!componentEntity) {
      throw new ProjectException(DATA_MISS);
    }
    const result = await this.componentRepository.delete(componentEntity.id);
    if (result.affected > 0) {
      return componentEntity;
    }
    throw new ProjectException(DATA_NO_AFFECTED);
  }
}
