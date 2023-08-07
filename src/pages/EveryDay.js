import React from 'react';
import { useFetch } from 'use-http';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdViewDay } from 'react-icons/md';
import DataBlock from '@/components/DataBlock';
import EChart from '@/components/echarts/Echart';
import useTableData from '@/components/origin_table/useTableData';
import { toast } from '@/components/toastify';

function EveryDay() {
  const { post, loading } = useFetch('/pub/user');
  const navigate = useNavigate();
  const option = {
    title: {
      text: '历史趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['用户量', '浏览量', '转化率'],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '用户量',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '浏览量',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '转化率',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
    ],
  };
  const viewByDate = (col, line) => {
    console.log('col, line', col, line);
    toast.success('多余功能');
  };

  const updateByDate = (col, line = {}) => {
    navigate('/add_everyday', { state: line });
  };

  const addDay = () => {
    navigate('/add_everyday');
  };
  const { html, setDatas } = useTableData({
    columns: [
      { name: 'day', label: '日期', type: 'string' },
      { name: 'lookCount', label: '浏览量', type: 'string' },
      { name: 'allCount', label: '访问量', type: 'string' },
      { name: 'rate', label: '转化率', type: 'string' },
      {
        name: 'custom',
        label: '操作',
        type: 'custom',
        render: (col, line) => {
          console.log('data', col, line);
          return (
            <div className="flex items-center space-x-2">
              <div
                className="btn btn-outline-secondary cursor-pointer rounded-md text-black/50 hover:text-black hover:font-medium"
                onClick={ () => viewByDate(col, line) }
              >
                { loading && (
                  <AiOutlineLoading3Quarters className="w-4 h-4" />
                ) }查看
              </div>
              <div
                className="btn btn-outline-secondary cursor-pointer rounded-md text-black/50 hover:text-black hover:font-medium"
                onClick={ () => updateByDate(col, line) }
              >
                修改
              </div>
            </div>
          );
        },
      },
    ],
    data: [
      {
        day: '1994/11/26', lookCount: '28', allCount: 'some where', rate: '1',
      },
      {
        day: '2023/07/20', lookCount: '36', allCount: 'some where', rate: '2',
      },
    ],
  });
  React.useEffect(() => {
    post('/getDayHtmlList', {})
      .then((response) => {
        const { returnCode, data = {} } = response || {};
        if (returnCode === 'undefined') return;
        if (returnCode !== '0000') {
          // toast.error(`${returnCode}--returnMessage-${returnMessage}`);
          return;
        }
        console.log('response=====', response);
        setDatas(data.list || []);
      });
  }, []);
  return (
    <div className="py-8 px-5">
      <div>
        <div className="flex items-center space-x-2">
          <MdViewDay className="w-6 h-6" />
          <div className="font-bold text-xl">每日一句</div>
        </div>
        <div className="flex">
          <DataBlock
            className="w-fit mt-3 mb-6 space-x-5"
            data={ [
              { name: '今日浏览量', value: 100, iconUrl: 'https://lixiaoyun-files.lixiaoyun.com/lixiaoyun--LX.png' },
              { name: '今日用户量', value: 500, iconUrl: 'https://lixiaoyun-files.lixiaoyun.com/lixiaoyun--LX.png' },
              { name: '今日转化率', value: '30%', iconUrl: 'https://lixiaoyun-files.lixiaoyun.com/lixiaoyun--LX.png' },
            ] }
          />
          <div className="flex-1 flex justify-end">
            <div
              className="flex items-center h-10 btn btn-primary bg-primary-500 group hover:bg-primary-600 space-x-2 rounded-md cursor-pointer"
              onClick={ () => addDay() }
            >
              <IoIosAddCircleOutline className="w-5 h-5" />
              <div className="group-hover:font-medium text-lg">新增</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-md shadow-gray-200">
        <EChart
          className="w-full h-80"
          chartOption={ option }
          onEChartItemClick={ (item) => {
            console.log('item click:', item);
          } }
        />
      </div>
      <div className="mt-6 bg-white p-5 rounded-lg shadow-md shadow-gray-200">
        { html }
      </div>
    </div>
  );
}

export default EveryDay;
