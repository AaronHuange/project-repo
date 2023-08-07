import React from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

function useTableData({
  columns = [],
  data = [],
  onRowClick,
}) {
  const [datas, setDatas] = React.useState(data);
  const tableRowClick = (item, index) => {
    onRowClick?.(item, index);
  };
  const renderValue = (value, type = 'string', col = {}, line = {}) => {
    if (type === 'custom') return col.render(col, line);

    if (type === 'string' && value?.startsWith('data:image/png;base64')) {
      return (
        <div onClick={ (e) => {
          const img = new Image();
          img.src = value;
          const newWin = window.open('', '_blank');
          newWin.document.write(img.outerHTML);
          newWin.document.title = '签名';
          newWin.document.close();
          e.stopPropagation();
        } }
        >
          <img
            className="w-5 h-5 cursor-pointer"
            src={ value }
            alt="base64-img"
          />
        </div>
      );
    }
    // return (type === 'date' && value) ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value;
    if (col?.name === 'day') return `${value.substring(0, 4)}年${value.substring(4, 6)}月${value.substring(6, 8)}日`;
    if (type === 'bool') return value ? '是' : '否';
    if (type === 'datetime') return dayjs(new Date(Number.parseInt(value, 10))).format('YYYY年MM月DD日');
    return value;
  };

  const tableBodyRef = React.useRef(null);
  const html = (
    <div
      className="flex flex-col h-full z-10 overflow-hidden"
      style={ { width: 'calc(100% - 0px)' } }
    >
      <div className="origin-table overflow-x-auto overflow-y-auto">
        <table className="w-full bg-white border-spacing-0 border-collapse table-fixed pb-14">
          <thead>
            <tr className="sticky -top-px bg-gray-100 h-10 z-20">
              {
                columns.map((col, index) => {
                  let thClassNames = 'w-44 cursor-pointer text-gray-800 text-left text-sm py-2 px-2.5 border truncate';
                  if (col.name === 'id') {
                    thClassNames = 'w-24 cursor-pointer text-gray-800 text-left text-sm py-2 px-2.5 border';
                  }
                  return (
                    <th
                      key={ `table-th-${col.name}` }
                      className={ thClassNames }
                    >
                      <div className={ classnames('flex  items-center', col.name === 'id' ? 'justify-center' : 'justify-start')}>
                        <span>{ col.label }</span>
                        <span
                          onClick={ () => console.log(`拖动第${index}列`) }
                          className="cursor-col-resize w-1 absolute top-0 bottom-0 right-0"
                          onMouseDown={ (e) => console.log('down:', e) }
                          onMouseMove={ (e) => console.log('move:', e) }
                          onMouseUp={ (e) => console.log('up:', e) }
                        />
                      </div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody ref={ tableBodyRef }>
            {
              datas.map((item, index) => (
                <tr
                  key={ `data-tr-${100 * index}` }
                  className="hover:bg-gray-100"
                  onClick={ () => tableRowClick(item, index) }
                >
                  {
                    columns.map((col) => (
                      <td
                        key={ `data-td-${col.name}` }
                        className={ classnames(
                          'text-gray-800  text-sm py-2 px-2.5 border border-l-0 break-all',
                          col.name === 'id' ? 'text-center' : 'text-left'
                        ) }
                      >
                        <div className="line-clamp-2">
                          { renderValue(item[col.name], col.type, col, item) }
                        </div>
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  return {
    html,
    setDatas,
  };
}

export default useTableData;
