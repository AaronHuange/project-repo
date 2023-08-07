import React from 'react';
import classnames from 'classnames';

/**
 * @params {Object} {"total_count":25,"page_size":25,"total_page":1,"current_page":1,"next_page":null,"prev_page":null,"is_first_page":true,"is_last_page":true}
 */
function SmallPagination({
  pagination = {},
  onChange,
  className = 'h-20', style,
}) {
  const newPagination = {
    current_page: pagination.current_page || pagination.currentPage || pagination.page || 1,
    page_size: pagination.page_size || pagination.pageSize || pagination.size || 15,
    total_pages: pagination.total_page || pagination.total_pages || pagination.totalPage || pagination.totalPages || pagination.pages || 0,
    total_count: pagination.total_count || pagination.totalCount || pagination.total || 0,
  };

  const paginationDetail = React.useMemo(() => {
    const { current_page = 1, total_count = 0, page_size = 25 } = newPagination || {};
    const newPaginationDetail = {
      current_page,
      total_count,
      page_size,
    };
    newPaginationDetail.prev_page = current_page > 1;
    newPaginationDetail.total_pages = Math.ceil(total_count / page_size);
    newPaginationDetail.next_page = current_page < newPaginationDetail.total_pages;
    return newPaginationDetail;
  }, [newPagination.current_page, newPagination.page_size, newPagination.total_count]);
  //
  return (
    <div
      className={classnames(
        'flex justify-around items-center w-full text-gray-600 text-sm',
        className
      )}
      style={style}
    >
      <button
        type="button"
        className={classnames(
          'w-1/2 hover:text-primary-500 disabled:text-gray-600 active:text-primary-300',
          paginationDetail.prev_page ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        )}
        disabled={!paginationDetail.prev_page}
        onClick={() => {
          if (paginationDetail.prev_page) {
            onChange(paginationDetail.current_page - 1, paginationDetail.page_size);
          }
        }}
      >上一页
      </button>
      <button
        type="button"
        className={classnames(
          'w-1/2 hover:text-primary-500 disabled:text-gray-600 active:text-primary-300',
          paginationDetail.next_page ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        )}
        disabled={!paginationDetail.next_page}
        onClick={() => {
          if (paginationDetail.next_page) {
            onChange?.(paginationDetail.current_page + 1, paginationDetail.page_size);
          }
        }}
      >下一页
      </button>
    </div>
  );
}

export default SmallPagination;
