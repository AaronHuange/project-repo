import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from 'use-http';
import { AiFillBulb, AiOutlineFilter } from 'react-icons/ai';
import {
  BsChevronCompactRight, BsChevronDown, BsFilterLeft, BsChevronUp,
} from 'react-icons/bs';
import { RiRefreshLine } from 'react-icons/ri';
import { LiaSearchSolid } from 'react-icons/lia';
import useCreate from '@/hooks/useCreate';
import useToggle from '@/hooks/useToggle';
import http from '@/config/http';
import { toast } from '@/components/toastify';

function BookManager() {
  const { post, loading } = useFetch(http.dev.httpProvider);
  const [searchFilter, setSearchFilter] = React.useState('手机号');
  const [searchValue, setSearchValue] = React.useState('');
  const [group, setGroup] = React.useState([]);
  const [activeLabel, setActiveLabel] = React.useState('');
  const [demandList, setDemandList] = React.useState([]);
  // const [] = React.useState(false);
  useCreate(() => {
    // 编辑中，核对中, 讨论中，需求确定，方案确定，开发，内测，上线, 已过期
    setGroup(['编辑中', '核对中', '讨论中', '需求确定', '方案确定', '开发', '内测', '上线', '已过期']);
    setActiveLabel('核对中');
    setDemandList([]);
  });
  const toggle = useToggle();
  const searchBook = () => {
    const searchMap = {
      手机号: { phone: searchValue },
      昵称: { nickname: searchValue },
      需求标题: { title: searchValue },
    };
    post('/pri/user/searchDemand', {
      data: { status: activeLabel, ...searchMap[searchFilter] },
    }).then((response) => {
      const { returnCode, data } = response || {};
      if (returnCode !== '0000') {
        return;
      }
      setDemandList(data.list);
    });
  };
  React.useEffect(() => searchBook(), [activeLabel]);

  return (
    <div className="py-8 px-5">
      <div className="flex items-center space-x-2">
        <div className="flex h-10 items-center space-x-2">
          <AiFillBulb className="w-6 h-6" />
          <div className="font-bold text-xl">功能孵化</div>
        </div>
      </div>
      <div className="mt-8 mb-6 pl-4 pr-2 w-full flex justify-center items-center rounded-xl ring-1 ring-gray-500">
        <div
          className="group relative flex items-center border-r border-solid border-primary-200 pr-2 cursor-pointer"
          onClick={() => toggle.toggle('book/search')}
        >
          <AiOutlineFilter className="group-hover:text-primary-600 w-4 h-4" />
          <div className="text-black/60 group-hover:text-primary-600 w-20 px-2">{searchFilter}</div>
          {!toggle.toggled('book/search') && <BsChevronDown className="group-hover:text-primary-600 w-4 h-4" />}
          {toggle.toggled('book/search') && <BsChevronUp className="group-hover:text-primary-600 w-4 h-4" />}
          {toggle.toggled('book/search') && (
            <div className="dropdown !w-32 !top-9 !-left-3">
              {[
                '手机号', '昵称', '需求标题',
              ].map((filterItem, index) => (
                <div key={`filter-${index * 100}`} className="dropdown-item" onClick={() => setSearchFilter(filterItem)}>
                  {filterItem}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          className="px-3 h-11 flex-1 text-black py-0.5"
          value={searchValue}
          type="text"
          onFocus={() => {}}
          onBlur={() => {}}
          placeholder="输入相关内容搜索"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div
          className="btn btn-primary cursor-pointer w-fit h-fit flex items-center space-x-1 rounded-full !px-5 py-1 text-white"
          onClick={() => searchBook()}
        >
          <LiaSearchSolid className="w-4 h-4" />
          <div>搜索</div>
        </div>
      </div>
      <div className="flex items-center px-5 space-x-3">
        <div className="text-black/50 mr-10">分组筛选</div>
        {group.map((item, index) => (
          <div
            key={`group-${index * 100}`}
            className={`relative btn btn-primary rounded-full !px-5 cursor-pointer text-white ${activeLabel === item ? '!bg-primary-900' : '!bg-primary-300 !text-primary-900'} !hover:bg-primary-500`}
            onClick={() => setActiveLabel(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-between mt-6 pt-8 border-t border-solid">
        <div className="flex items-center">
          <div className="text-black font-medium cursor-default"> 总共{ demandList?.length || 0 }条数据 </div>
          <RiRefreshLine onClick={() => searchBook()} className={`ml-3 cursor-pointer text-black hover:text-primary-900 ${loading ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex items-center px-2 py-1 border border-solid border-primary-500 rounded-full">
          <BsFilterLeft className="w-4 h-4 text-primary-500" />
          <div className="px-3 text-black/60">过滤项</div>
          <BsChevronDown className="w-4 h-4 text-primary-500" />
        </div>
      </div>
      <div className="grid grid-cols-3 p-5 gap-5">
        {demandList?.map((demand, index) => (
          <div
            key={`book-list-${index * 100}`}
            className="bg-white min-w-[390px] shadow shadow-gray-300/60 p-6 rounded-lg"
          >
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-14 flex flex-col justify-between">
                  <div className="text-black/50 text-sm">{demand.status}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-medium">{demand.title}</div>
                    <div className="bg-red-50/50 rounded px-2 py-0.5 text-black/30 text-xs cursor-default">{demand.year_month_str}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="text-primary-400">{demand.nickname || demand.phone}</div>
                  <div className="bg-red-50/50 rounded flex items-center px-2 py-0.5 text-black/30 text-xs cursor-default">同意：{demand.agree}</div>
                  <div className="bg-red-50/50 rounded flex items-center px-2 py-0.5 text-black/30 text-xs cursor-default">不同意：{demand.disagree}</div>
                </div>
              </div>
              <img className="w-20 rounded-full h-20 shadow-lg shadow-gray-300" src={demand.header_url} alt="" />
            </div>
            {demand.start_time && (
              <div className="flex items-center space-x-2 pt-2">
                <div className="text-black/40 text-xs cursor-default">开始：{demand.start_time?.replaceAll('-', '/')}</div>
                <div className="text-black/40 text-xs cursor-default">预计上线：{demand.end_time?.replaceAll('-', '/')}</div>
              </div>
            )}
            <p className="pt-2 text-black/80 text-sm line-clamp-3 text-ellipsis h-14 flex break-words">
              {demand.desc_info}
            </p>
            {demand.step === -2 && (
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-2">
                  <div
                    className="rounded-full px-3 py-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-900 hover:text-primary-700 cursor-pointer"
                    onClick={() => {
                      // 将当前需求状态改为讨论中
                      post('/pri/user/changeStatus', {
                        data: { newStatus: '讨论中', demandId: demand.id },
                      }).then(() => {
                        toast.success('修改成功');
                        // 删除当前item
                        const tempDemandList = [...demandList];
                        tempDemandList.splice(tempDemandList.findIndex(demand), 1);
                        setDemandList(tempDemandList);
                      }).catch(() => {});
                    }}
                  >
                    核对确认
                  </div>
                </div>
                <div onClick={() => {}} className={`flex items-center cursor-pointer group ${demand.step >= -2 ? '' : 'hidden'}`}>
                  <div className="text-black/60 group-hover:text-black"> 修改建议 </div>
                  <BsChevronCompactRight className="w-4 h-4 text-black/60 group-hover:text-black" />
                </div>
              </div>
            )}
            {demand.step === -1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-2" />
                <div onClick={() => {}} className={`flex items-center cursor-pointer group ${demand.step >= -2 ? '' : 'hidden'}`}>
                  <div className="text-black/60 group-hover:text-black"> 选中需求 </div>
                  <BsChevronCompactRight className="w-4 h-4 text-black/60 group-hover:text-black" />
                </div>
              </div>
            )}
            {demand.step === 0 && (
              <div>0</div>
            )}
            {demand.step === 1 && (
              <div>1</div>
            )}
            {demand.step === 2 && (
              <div>2</div>
            )}
            {demand.step === 3 && (
              <div>3</div>
            )}
            {demand.step === 4 && (
              <div>4</div>
            )}
            {demand.step === 5 && (
              <div className="flex justify-between items-center mt-6">
                <div className={`flex space-x-2 ${demand.step >= 0 ? '' : 'invisible'}`}>
                  <div
                    className="rounded-full px-3 py-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-900 hover:text-primary-700 cursor-pointer"
                    onClick={() => {
                    }}
                  >
                    核对确认
                  </div>
                  <div
                    className="rounded-full px-3 py-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-900 hover:text-primary-700 cursor-pointer"
                    onClick={() => {}}
                  >
                    编辑内容
                  </div>
                </div>
                <div className={`flex items-center cursor-pointer group ${demand.step >= -2 ? '' : 'hidden'}`}>
                  <Link to="/readbook" state={{ demand }} className="text-black/60 group-hover:text-black"> 更改状态 </Link>
                  <BsChevronCompactRight className="w-4 h-4 text-black/60 group-hover:text-black" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookManager;
