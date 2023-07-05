export const usePageResult = async <T>(
  pagination,
  queryBuilder,
): Promise<[T[], Number]> => {
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
