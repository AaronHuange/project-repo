import { Args, Query } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { Form } from '@/models/form.model';
import { FormService } from '@/modules/form/form.service';

@Injectable()
export class FormPublishResolver {
  constructor(
    private readonly formService: FormService,
  ) {
  }

  @Query(() => Form)
  async formPublish(
    @Args({
      name: 'formId',
      type: () => String,
    })
      formId: string,
  ): Promise<Form> {
    return this.formService.findPublishForm(formId);
  }
}
