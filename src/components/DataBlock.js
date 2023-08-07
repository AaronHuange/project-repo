import React from 'react';

// 数据块组件
function DataBlock({ data = [], className = '' }) {
  return (
    <div className={`flex justify-between items-center space-x-3 ${className}`}>
      {data.map((item, index) => (
        <div key={`data-${index * 100}`} className="flex bg-white rounded-xl shadow-md shadow-gray-200 px-5 py-5">
          <img className="w-12 h-12 rounded-md mr-3" src={item.iconUrl} alt="icon" />
          <div>
            <div className="text-black/70 text-sm">{ item.name }</div>
            <div className="font-bold text-2xl text-primary-900">{ item.value }</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DataBlock;
