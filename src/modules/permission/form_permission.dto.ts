import { ObjectType } from '@nestjs/graphql';
import { Page } from '@/models/base/pagination';
import { FormPermission } from '@/models/form_permission.model';

@ObjectType()
export class FormPermissionPage extends Page(FormPermission) {}
