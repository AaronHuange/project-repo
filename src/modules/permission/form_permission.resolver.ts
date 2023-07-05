import { Brackets } from 'typeorm';
import {
  Args, Mutation, Parent, Query, ResolveField, Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { FormPermission } from '@/models/form_permission.model';
import { FormPermissionService } from './form_permission.service';
import { FormPermissionPage } from './form_permission.dto';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { User } from '@/filters/user.decorator';
import { Filter, GraphqlFilter } from '@/graphql/filter/filter.decorator';
import { UpdateFormPermissionInput } from './inputs/update_form_permission.input';
import { AddFormPermissionInput } from './inputs/add_form_permission.input';
import { UserType } from '@/graphql/types/user.type';
import { ApiService } from '@/modules/api/service';
import {
  DeleteFormPermissionInput,
} from '@/modules/permission/inputs/delete_form_permission.input';

@Resolver(() => FormPermission)
@UseGuards(PaaSAuthGuard)
export class FormPermissionResolver {
  constructor(
    private readonly formPermissionService: FormPermissionService,
    private readonly apiService: ApiService,
  ) {
  }

  @Query(() => FormPermissionPage)
  @GraphqlFilter()
  queryFormPermission(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
    })
      pagination: PaginationInput,
    @Filter(() => FormPermission, { sqlAlias: 'f' }) filter: Brackets,
  ): Promise<FormPermissionPage> {
    return this.formPermissionService.queryFormPermission({
      pagination,
      filter,
    });
  }

  @ResolveField('user', () => UserType, { nullable: true })
  async getUser(@Parent() formPermission: FormPermission) {
    if (formPermission?.userId) {
      const { userId } = formPermission;
      const user = await this.apiService.findUser(userId);
      if (user) {
        const userType = new UserType();
        userType.fromICloudUserInfo(user);
        return userType;
      }
    }
    return null;
  }

  @Mutation(() => [FormPermission])
  addFormPermission(
    @User() user,
    @Args({
      name: 'input',
      type: () => AddFormPermissionInput,
    })
      addFormPermissionInput: AddFormPermissionInput,
  ): Promise<Array<FormPermission>> {
    return this.formPermissionService.addFormPermission(
      user,
      addFormPermissionInput,
    );
  }

  @Mutation(() => FormPermission)
  updateFormPermission(
    @User() user,
    @Args({
      name: 'input',
      type: () => UpdateFormPermissionInput,
    })
      updateFormPermissionInput: UpdateFormPermissionInput,
  ): Promise<FormPermission> {
    return this.formPermissionService.updateFormPermission(
      user,
      updateFormPermissionInput,
    );
  }

  @Mutation(() => Number)
  deleteFormPermission(
    @User() user,
    @Args({
      name: 'input',
      type: () => DeleteFormPermissionInput,
    })
      deleteFormPermissionInput: DeleteFormPermissionInput,
  ): Promise<FormPermission> {
    return this.formPermissionService.deleteFormPermission(
      user,
      deleteFormPermissionInput,
    );
  }
}
