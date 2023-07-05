export type ObjectColumnType = 'string' | 'number' | 'date' | 'bool' | 'json';

export interface CreateObjectColumn {
  name: string,
  type: ObjectColumnType,
}

export interface ObjectTable {
  tableId: number,
  name: string,
  columns: CreateObjectColumn[],
}
