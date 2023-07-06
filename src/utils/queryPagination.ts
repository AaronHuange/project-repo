import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export class PaginationInput {
  page: number;
  pageSize: number;
}

/** 将typeorm的查询进行分页返回 **/
export const queryPagination = async <T>({
  pagination, queryBuilder,
} : {
  pagination?: PaginationInput,
  queryBuilder: SelectQueryBuilder<T>,
}): Promise<[T[], Number]> => {
  const count = await queryBuilder.getCount();
  const data: T[] = [];
  if (count > 0) {
    if (pagination) {
      data.push(
        ...(await queryBuilder
          .skip((pagination.page - 1) * pagination.pageSize)
          .take(pagination.pageSize)
          .getMany()),
      );
    } else {
      data.push(...(await queryBuilder.limit(1000).getMany()));
    }
  }
  return [data, count];
};
