import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UseGuards } from '@nestjs/common';
import { Form } from '@/models/form.model';
import {
  CreateFormInputType,
  UpdateFormInputType,
} from '@/modules/form/inputs/form.input';
import { FormService } from '@/modules/form/form.service';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { FormPage } from '@/modules/form/form.page.dto';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { User } from '@/filters/user.decorator';
import { Filter, GraphqlFilter } from '@/graphql/filter/filter.decorator';
import { FormFilterType } from '@/modules/form/filters/form.filter';
import { OrderByInput } from '@/graphql/filter/orderby.input';
import { ApiService } from '@/modules/api/service';
import { UserType } from '@/graphql/types/user.type';
import { FormStore } from '@/models/form_store.model';
import { FormPermission } from '@/models/form_permission.model';

@Resolver(() => Form)
@UseGuards(PaaSAuthGuard)
export class FormResolver {
  constructor(
    private readonly formService: FormService,
    private readonly apiService: ApiService,
    @InjectRepository(FormStore)
    private readonly formStoreRepository: Repository<FormStore>,
    @InjectRepository(FormPermission)
    private readonly formPermissionRepository: Repository<FormPermission>,
  ) {
  }

  @Query(() => FormPage)
  @GraphqlFilter()
  async queryForm(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
      nullable: true,
    })
      pagination: PaginationInput,
    @Args({
      name: 'orderBy',
      type: () => OrderByInput,
      nullable: true,
    })
      orderBy: OrderByInput,
    @Filter(() => FormFilterType, { sqlAlias: 'f' }) filter: Brackets,
  ): Promise<FormPage> {
    return this.formService.query(user, pagination, filter, orderBy);
  }

  /**
   * @param user
   * @param pagination
   * @param orderBy
   * @param filter
   */
  @Query(() => FormPage)
  @GraphqlFilter()
  async queryTrashForm(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
    })
      pagination: PaginationInput,
    @Args({
      name: 'orderBy',
      type: () => OrderByInput,
      nullable: true,
    })
      orderBy: OrderByInput,
    @Filter(() => FormFilterType, { sqlAlias: 'f' }) filter: Brackets,
  ): Promise<FormPage> {
    return this.formService.queryTrash(user, pagination, filter, orderBy);
  }

  @ResolveField('owner', () => UserType, { nullable: true })
  async getOwner(@Parent() from: Form) {
    if (from?.ownerId) {
      const { ownerId } = from;
      const user = await this.apiService.findUser(ownerId);
      if (user) {
        const owner = new UserType();
        owner.fromICloudUserInfo(user);
        return owner;
      }
    }
    return null;
  }

  @ResolveField('tableName', () => String, { nullable: true })
  async getTableName(@Parent() from: Form) {
    const { id } = from;
    if (id) {
      const formStore = await this.formStoreRepository.findOneBy({
        formId: id,
      });
      if (formStore) {
        return formStore.tableName;
      }
    }
    return null;
  }

  @ResolveField('permission', () => FormPermission, { nullable: true })
  async getPermission(
    @Parent() from: Form,
    @User() user,
  ) {
    return this.formPermissionRepository.findOneBy({
      formId: from.id,
      userId: user.id,
    });
  }

  @Mutation(() => Form)
  async createForm(
    @User() user,
    @Args({
      name: 'input',
      type: () => CreateFormInputType,
    })
      form: CreateFormInputType,
  ): Promise<Form> {
    return this.formService.create(user, form);
  }

  @Mutation(() => Form)
  @GraphqlFilter()
  async updateForm(
    @User() user,
    @Args({
      name: 'input',
      type: () => UpdateFormInputType,
    })
      form: UpdateFormInputType,
    @Filter(() => FormFilterType, { sqlAlias: 'f' }) filter: Brackets,
  ) {
    return this.formService.update(user, form, filter);
  }

  @Mutation(() => Form)
  @GraphqlFilter()
  async publishForm(
    @User() user,
    @Args({
      name: 'formId',
      type: () => String,
    })
      formId: string,
  ) {
    return this.formService.publish(user, formId);
  }

  @Mutation(() => Form)
  @GraphqlFilter()
  async destroyForm(
    @User() user,
    @Filter(() => FormFilterType, { sqlAlias: 'f' }) filter: Brackets,
  ) {
    return this.formService.destroy(user, filter);
  }
}
