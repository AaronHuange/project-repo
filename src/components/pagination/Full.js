import React from 'react';
import classnames from 'classnames';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';

/**
 * @params {Object} {"total_count":25,"page_size":25,"total_pages":1,"current_page":1,"next_page":null,"prev_page":null,"is_first_page":true,"is_last_page":true}
 */
function FullPagination({
  pagination = {}, onChange, onPageSizeChange,
  className = 'h-20', style,
  defaultPageSizeList = [5, 10, 25, 50, 100, 200, 500],
  maxPageSize = 500,
}) {
  const newPagination = {
    current_page: pagination.current_page || pagination.currentPage || pagination.page || 1,
    page_size: pagination.page_size || pagination.pageSize || pagination.size || 15,
    total_pages: pagination.total_page || pagination.total_pages || pagination.totalPage || pagination.totalPages || pagination.pages || 0,
    total_count: pagination.total_count || pagination.totalCount || pagination.total || 0,
  };
  const pageSizeList = defaultPageSizeList.filter((size) => size <= maxPageSize);
  const [dropdown, setDropdown] = React.useState(null);
  const [targetPage, setTargetPage] = React.useState(newPagination?.current_page);
  const outsideClickClass = 'outside-click-class';
  const toggleDropdown = (name) => {
    if (dropdown === name) {
      setDropdown(null);
      return;
    }
    setDropdown(name);
  };

  //
  if ([null, undefined].includes(newPagination?.next_page)
    || [null, undefined].includes(newPagination?.prev_page)
    || [null, undefined].includes(newPagination?.is_first_page)
    || [null, undefined].includes(newPagination?.is_last_page)) {
    if (newPagination?.current_page < newPagination?.total_pages) {
      newPagination.next_page = newPagination.current_page + 1;
    } else {
      newPagination.next_page = null;
    }
    if (newPagination?.current_page > 1) {
      newPagination.prev_page = newPagination.current_page - 1;
    } else {
      newPagination.prev_page = null;
    }
    newPagination.is_first_page = newPagination?.current_page === 1;
    newPagination.is_last_page = (newPagination?.current_page === newPagination?.total_pages);
  }
  //
  const {
    total_count, page_size, total_pages,
    current_page, next_page, prev_page,
    is_first_page, is_last_page,
  } = newPagination;
  React.useEffect(() => {
    if (targetPage !== current_page) {
      setTargetPage(current_page);
    }
  }, [current_page]);

  const changeTargetPage = (e) => {
    const page = e.target.value?.trim();
    if (page === '' || (page > 0 && page <= total_pages)) {
      const pageNum = parseInt(page, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(pageNum)) {
        setTargetPage(page);
      } else {
        setTargetPage(pageNum);
      }
    }
  };

  const confirmTargetPage = () => {
    const allow = current_page !== targetPage && ![null, undefined, ''].includes(targetPage);
    if (allow) {
      onChange?.(targetPage, page_size);
    } else {
      setTargetPage(current_page);
    }
  };
  const isDisplayPagination = (total_pages || 0) > 0 && total_count > (pageSizeList.length > 0 ? pageSizeList[0] : 5);
  return isDisplayPagination && (
    <div
      className={classnames(
        'flex justify-between items-center w-100 text-gray-900 text-sm dark:text-dark-850 ',
        className
      )}
      style={style}
    >
      <div>{total_count} 条数据</div>
      <div className="flex items-center">
        <div
          className={classnames(
            'mr-6',
            prev_page ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          )}
          onClick={() => {
            if (!is_first_page && prev_page > 0) {
              onChange(prev_page, page_size);
            }
          }}
        >上一页
        </div>
        <div className="flex items-center">
          <span className="mr-2">第</span>
          <div className="relative">
            <input
              type="text"
              onChange={changeTargetPage}
              onBlur={confirmTargetPage}
              onKeyDown={(e) => {
                if (e?.key === 'Enter') {
                  confirmTargetPage();
                }
              }}
              className="border border-gray-200 text-gray-600 rounded focus:text-black
              focus:ring-primary-500 focus:border-primary-500 w-12 text-center px-2 py-1
              dark:border-dark-500 dark:text-dark-850
              "
              value={targetPage ?? 1}
            />
          </div>
          <span className="ml-2">/ {total_pages}页</span>
        </div>
        <div
          className={classnames(
            'ml-6',
            next_page ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          )}
          onClick={() => {
            if (!is_last_page && next_page > 0) {
              onChange?.(next_page, page_size);
            }
          }}
        >下一页
        </div>
      </div>

      {pageSizeList?.length > 1 && (
        <div className="relative" id="outside-click-id">
          <span className="mr-2">每页</span>
          <input
            type="text"
            readOnly
            className={`${outsideClickClass} border border-gray-200 text-gray-600 rounded 
            focus:text-black focus:ring-primary-500 focus:border-primary-500 w-20 px-2 py-1 pr-5
            dark:border-dark-500 dark:text-dark-850 dark:focus:text-dark-800
            `}
            value={page_size ?? 1}
            onClick={() => toggleDropdown('pageSize')}
          />
          <div
            onClick={() => toggleDropdown('pageSize')}
            className={`${outsideClickClass} absolute inset-y-0 right-1.5 flex items-center`}
          >
            {dropdown === 'pageSize' ? <RiArrowUpSFill className="text-gray-400" />
              : <RiArrowDownSFill className="text-gray-400" />}
          </div>

          {dropdown === 'pageSize' && (
            <div
              className="dropdown dropdown-right w-20 dropdown-up"
            >
              <ul
                className={`py-1 ${pageSizeList.length <= 5 && [`min-h-${pageSizeList.length * 2}rem`]}`}
              >
                {pageSizeList.map((number) => (
                  <li key={`size_${number}`}>
                    <div
                      className={`dropdown-item min-w-[2rem] ${outsideClickClass}`}
                      onClick={() => {
                        onPageSizeChange?.(number);
                        toggleDropdown('pageSize');
                      }}
                    >
                      {page_size === number ? (
                        <span className="text-primary-500">{number}</span>
                      ) : (
                        <span>{number}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default FullPagination;
