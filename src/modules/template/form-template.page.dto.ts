import { ObjectType } from '@nestjs/graphql';
import { Page } from '@/models/base/pagination';
import { FormTemplate } from '@/models/form_template.model';

@ObjectType()
export class FormTemplatePage extends Page(FormTemplate) {}
