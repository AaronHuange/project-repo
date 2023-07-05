export interface SelectPermissionParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  formDataTableName?: string;
  formId?: string;
}

export type FormPermissionType = 'form' | 'data';

export interface InsertFormPermission {
  dataPermissions: null;
  formPermissions: null;
  type: FormPermissionType;
  formDataTableName: string;
  formId: string;
  userId: string;
  deadline: Date;
}

export type FormPermissions = {
  id: string;
  dataPermissions: null;
  formPermissions: null;
  type: string;
  formDataTableName: string;
  formId: string;
  userId: string;
  deadline: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};
