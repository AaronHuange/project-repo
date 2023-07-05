import { GQLResponseError } from '@/interfaces/response.interface';

export interface ICloudUserInfo {
  id: string;
  name: string;
  mobile: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
  // 将要弃用
  uid: string;
  //
  authorization?: string,
}

export interface ObjectAppPlatform {
  id: string,
  name: string,
  serviceApiKey: string,
  createdAt: string,
}

export class ApiGraphqError extends Error {
  constructor(private errs: [GQLResponseError]) {
    super(errs[0].message);
  }
}

export interface Column {
  table_id: number;
  schema: string;
  table: string;
  id: string;
  ordinal_position: number;
  name: string;
  default_value?: string;
  data_type: string;
  format: string;
  is_identity: boolean;
  identity_generation?: string;
  is_generated: boolean;
  is_nullable: boolean;
  is_updatable: boolean;
  is_unique: boolean;
  enums: string[];
  check?: string;
  comment?: string;
}

export interface CreateColumn {
  table_id: number,
  name: string,
  type: string,
  default_value?: string,
  default_value_format?: string,
  is_identity?: boolean,
  identity_generation?: string,
  is_nullable?: boolean,
  is_primary_key?: boolean,
  is_unique?: boolean,
  comment?: string,
  check?: string,
}

export interface UpdateColumn {
  name?: string,
  type?: string,
  drop_default?: boolean,
  default_value?: string,
  default_value_format?: string,
  is_identity?: boolean,
  identity_generation?: string,
  is_nullable?: boolean,
  is_unique?: boolean,
  comment?: string,
  check?: string,
}

export interface CreateTable {
  name: string;
  schema?: string;
  comment?: string;
}

export interface Table {
  id: number;
  schema: string;
  name: string;
  rls_enabled: boolean;
  rls_forced: boolean;
  replica_identity: string;
  bytes: number;
  size: string;
  live_rows_estimate: number;
  dead_rows_estimate: number;
  comment?: string;
  columns: Column[];
}
