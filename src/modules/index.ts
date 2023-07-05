import { FormModule } from '@/modules/form/form.module';
import { FormPermissionModule } from './permission/form_permission.module';
import { CommonModule } from '@/modules/common/common.module';
import { ComponentModule } from '@/modules/component/component.module';

export const modules = [FormModule, CommonModule, ComponentModule, FormPermissionModule];
