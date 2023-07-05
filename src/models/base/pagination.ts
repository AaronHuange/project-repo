// eslint-disable-next-line max-classes-per-file
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationInput } from '@/modules/common/inputs/pagination.input';

@ObjectType()
export class Pagination {
  @Field(() => Int, { defaultValue: 1 })
  currentPage: number;

  @Field(() => Int, { defaultValue: 10 })
  pageSize: number;

  @Field(() => Int, { defaultValue: 0 })
  totalCount?: number;

  @Field(() => Int, { defaultValue: 0 })
  totalPages?: number;

  constructor(currentPage: number, pageSize: number) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }
}

export interface IPaginatedType<T> {
  data: T[];
  pagination: Pagination;
}

export function Page<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: true, defaultValue: [] })
    data: T[];

    @Field(() => Pagination)
    pagination: Pagination;

    protected constructor(
      data: T[],
      count: number,
      pagination: PaginationInput,
    ) {
      this.data = data;
      if (pagination) {
        this.pagination = new Pagination(pagination.page, pagination.pageSize);
        this.pagination.totalCount = count;
        this.pagination.totalPages = Math.ceil(count / pagination.pageSize);
      }
    }
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
