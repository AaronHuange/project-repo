import React from 'react';
import FullPagination from '@/components/pagination/Full';

function Pagination({
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  onChange,
  className = 'h-14',
  show = true,
}) {
  return show && (
    <div className={className}>
      <FullPagination
        className="h-14"
        maxPageSize={50}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
        }}
        onPageSizeChange={(size) => {
          onChange?.({
            page: 1, size,
          });
        }}
        onChange={(page) => {
          onChange?.({
            page,
          });
        }}
      />
    </div>
  );
}

export default Pagination;
