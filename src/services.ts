import { ApiService } from './modules/api/service';
import ObjectService from './modules/object/services/object';
import FormPermissionService from './modules/permission/services/permission';
import { CustomObjectService } from '@/modules/api/customObject.service';

export default [ApiService, CustomObjectService, FormPermissionService, ObjectService];
