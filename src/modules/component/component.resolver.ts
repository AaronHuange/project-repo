import {
 Args, Mutation, Query, Resolver,
} from '@nestjs/graphql';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UseGuards } from '@nestjs/common';
import { Component } from '@/models/component.model';
import {
  CreateComponentInputType,
  UpdateComponentInputType,
} from '@/modules/component/inputs/component.input';
import { ComponentService } from '@/modules/component/component.service';
import { Filter, GraphqlFilter } from '@/graphql/filter/filter.decorator';
import { User } from '@/filters/user.decorator';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { ComponentPage } from '@/modules/component/component.page.dto';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { ComponentFilterType } from '@/modules/component/filters/component.filter';

@Resolver(() => Component)
@UseGuards(PaaSAuthGuard)
export class ComponentResolver {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    private readonly componentService: ComponentService,
  ) {}

  @Query(() => ComponentPage)
  @GraphqlFilter()
  async queryComponent(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
      nullable: true,
    })
    pagination: PaginationInput,
    @Filter(() => ComponentFilterType, { sqlAlias: 'c' }) filter: Brackets,
  ): Promise<ComponentPage> {
    console.log('filter', filter, pagination);
    return this.componentService.query(user, pagination, filter);
  }

  @Query(() => ComponentPage)
  @GraphqlFilter()
  async queryTrashComponent(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
      nullable: true,
    })
    pagination: PaginationInput,
    @Filter(() => ComponentFilterType, { sqlAlias: 'c' }) filter: Brackets,
  ): Promise<ComponentPage> {
    return this.componentService.queryTrash(user, pagination, filter);
  }

  @Mutation(() => Component)
  async createComponent(
    @User() user,
    @Args('input') input: CreateComponentInputType,
  ): Promise<Component> {
    return this.componentService.create(user, input);
  }

  @Mutation(() => Component)
  @GraphqlFilter()
  async updateComponent(
    @User() user,
    @Args('input') input: UpdateComponentInputType,
    @Filter(() => ComponentFilterType, { sqlAlias: 'c' }) filter: Brackets,
  ): Promise<Component> {
    return this.componentService.update(user, input, filter);
  }

  @Mutation(() => Component)
  @GraphqlFilter()
  async destroyComponent(
    @User() user,
    @Filter(() => ComponentFilterType, { sqlAlias: 'c' }) filter: Brackets,
  ) {
    return this.componentService.destroy(user, filter);
  }
}
