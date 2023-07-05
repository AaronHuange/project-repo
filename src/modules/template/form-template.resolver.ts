import {
 Args, Mutation, Query, Resolver,
} from '@nestjs/graphql';
import { Brackets } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { User } from '@/filters/user.decorator';
import { Filter, GraphqlFilter } from '@/graphql/filter/filter.decorator';
import { FormTemplate } from '@/models/form_template.model';
import { FormTemplateService } from '@/modules/template/form-template.service';
import { FormTemplateFilterType } from '@/modules/template/filters/form-template.filter';
import { FormTemplatePage } from '@/modules/template/form-template.page.dto';
import {
  CreateFormTemplateInputType,
  UpdateFormTemplateInputType,
} from '@/modules/template/inputs/form-template.input';

@Resolver(() => FormTemplate)
@UseGuards(PaaSAuthGuard)
export class FormTemplateResolver {
  constructor(private readonly templateService: FormTemplateService) {}

  @Query(() => FormTemplatePage)
  @GraphqlFilter()
  async queryFormTemplate(
    @User() user,
    @Args({
      name: 'pagination',
      type: () => PaginationInput,
      nullable: true,
    })
    pagination: PaginationInput,
    @Filter(() => FormTemplateFilterType, { sqlAlias: 't' }) filter: Brackets,
  ): Promise<FormTemplatePage> {
    return this.templateService.query(user, pagination, filter);
  }

  /**
   * @param user
   * @param pagination
   * @param filter
   */
  @Query(() => FormTemplatePage)
  @GraphqlFilter()
  async queryTrashFormTemplate(
    @User() user,
    @Args('pagination') pagination: PaginationInput,
    @Filter(() => FormTemplateFilterType, { sqlAlias: 't' }) filter: Brackets,
  ): Promise<FormTemplatePage> {
    return this.templateService.queryTrash(user, pagination, filter);
  }

  @Mutation(() => FormTemplate)
  async createFormTemplate(
    @User() user,
    @Args('input') input: CreateFormTemplateInputType,
  ): Promise<FormTemplate> {
    return this.templateService.create(user, input);
  }

  @Mutation(() => FormTemplate)
  @GraphqlFilter()
  async updateFormTemplate(
    @User() user,
    @Args('input') input: UpdateFormTemplateInputType,
    @Filter(() => FormTemplateFilterType, { sqlAlias: 't' }) filter: Brackets,
  ) {
    return this.templateService.update(user, input, filter);
  }

  @Mutation(() => FormTemplate)
  @GraphqlFilter()
  async destroyFormTemplate(
    @User() user,
    @Filter(() => FormTemplateFilterType, { sqlAlias: 't' }) filter: Brackets,
  ) {
    return this.templateService.destroy(user, filter);
  }
}
