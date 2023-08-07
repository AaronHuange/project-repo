import React from 'react';
import dayjs from 'dayjs';
import { useFetch } from 'use-http';
import { BiSolidUserVoice } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/toastify';
import http from '@/config/http';

function ReadBook() {
  const { post } = useFetch(http.dev.bookHttp);
  const { bookName } = useLocation().state?.book || {};
  const [dataList, setDataList] = React.useState([]);
  const [readBtnItem, setReadBtnItem] = React.useState({
    音标: true, 中文: true, 单词: true, 音频: true,
  });
  const getAllDlByZj = (chapter, callback) => {
    post('/pub/bookread/getZj', {
      data: {
        bookName,
        zjName: chapter,
      },
    })
      .then((response) => {
        const { returnCode, returnMessage, data } = response || {};
        if (returnCode !== '0000') {
          toast.error(returnMessage);
          return;
        }
        const dlList = (data.contentList || []).map((item) => ({
          ...item,
          meiSoundMark: item.meiSoundMark?.split('片'),
          yinSoundMark: item.yinSoundMark?.split('片'),
          yin: item.yin?.split('片'),
        }));
        // "id" : 45, "bookName" : "测试图书", "chapter" : "测试", "timestamp" : 1690163669340, "wordCount" : 0,
        // "yin" : null, "han" : null, "yinSoundMark" : null, "meiSoundMark" : null, "mp3" : null, "free" : true, "addZj" : true
        callback?.(dlList);
      });
  };
  const [dlList, setDlList] = React.useState([]);
  React.useEffect(() => {
    // 获取所有章节信息
    post('/pub/bookread/getAllZj', {
      data: { bookName },
    }).then((response) => {
      const { returnCode, data } = response || {};
      if (returnCode === '0000') {
        setDataList([...(data.list || [])]);
      }
    });
  }, []);
  console.log('dlList====', dlList);
  // 渲染界面
  const readReportClassName = 'bg-gray-100 p-5 rounded-lg shadow shadow-gray-200 w-full flex flex-col justify-center items-center';
  return (
    <div className="p-5 flex flex-col h-screen">
      <div
        className="btn btn-link cursor-pointer w-fit mx-3"
        onClick={ () => window.history.back() }
      >
        <IoIosArrowBack className="w-4 h-4" />
        <div className="text-base">返回</div>
      </div>
      <div className="mt-3 p-3 rounded-lg flex space-x-2 h-0 flex-1">
        <div className="font-medium text-lg bg-white flex-1 p-5 flex flex-col">
          <div>{bookName}</div>
          <div className="flex justify-between space-x-5 my-8">
            <div className={readReportClassName}>
              <div>今天阅读量</div>
              <div>324人</div>
            </div>
            <div className={readReportClassName}>
              <div>近7天阅读量</div>
              <div>324人</div>
            </div>
            <div className={readReportClassName}>
              <div>总阅读量</div>
              <div>324人</div>
            </div>
          </div>
          <div className="flex-1 h-0 flex flex-col">
            <div>章节</div>
            <div key="zj-list-title" className="flex items-center my-6">
              <div className="w-10 text-sm text-black/50">序号</div>
              <div className="w-0 flex-1 text-sm text-black/50">章节名</div>
              <div className="w-20 text-sm text-black/50">是否免费</div>
              <div className="w-36 text-sm text-black/50">创建时间</div>
              <div className="w-28 text-sm text-black/50">操作</div>
            </div>
            <div className="overflow-y-auto h-0 flex-1">
              {dataList.map((zj, index) => (
                <div
                  key={`zj-list-${100 * index}`}
                  className="overflow-y-auto cursor-default flex items-center py-2 bg-gray-100 rounded-md my-5"
                >
                  <div className="flex justify-center items-center text-sm bg-primary-400 text-white/80 rounded-full mx-2 w-6 h-6">
                    {index + 1}
                  </div>
                  <div className="w-0 flex-1 text-sm text-black/50 px-2">
                    {zj.chapter}
                  </div>
                  <div className="w-20 text-sm text-black/50">
                    {zj.free ? '免费' : `${zj.free}元`}
                  </div>
                  <div className="w-36 text-sm text-black/50 px-2">
                    {dayjs(new Date(Number.parseInt(zj.createTime, 10))).format('YYYY年MM月DD日')}
                  </div>
                  <div className="w-28 text-sm text-black/50 px-2">
                    <div
                      className="btn btn-outline-secondary cursor-pointer w-fit h-fit rounded-full !px-3 !py-1 hover:bg-gray-200 text-white"
                      onClick={() => getAllDlByZj(zj.chapter, (dls) => setDlList(dls))}
                    >
                      阅读本章
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="relative cursor-pointer w-96"
          onClick={() => {}}
        >
          <div className="flex justify-between rounded-md space-x-2 w-[90%] absolute right-0">
            {(Object.keys(readBtnItem)).map((btnItem, index) => (
              <div
                key={`btn-${index * 100}`}
                className={`btn btn-primary rounded-full ${readBtnItem[btnItem] ? '' : '!bg-gray-500'}`}
                onClick={() => setReadBtnItem({ ...readBtnItem, [btnItem]: !readBtnItem[btnItem] })}
              >
                {btnItem}
              </div>
            ))}
          </div>
          <img className="absolute right-0 top-12 z-10 h-[90%] w-[90%]" src="/iphone.png" alt="phone" />
          <div className="absolute right-0 top-12 pt-2 flex flex-wrap mt-10 px-6 overflow-y-auto z-20 h-[82%] w-[90%]">
            {dlList.map((dl, index) => (
              <div className="flex flex-wrap mb-4" key={`dl-${index * 100}`}>
                {dl.yin.map((word, wordIndex) => (
                  <div
                    key={`word-${wordIndex * 100 + index}`}
                    className={`px-1 flex flex-col items-center ${wordIndex === 0 ? 'ml-8' : ''}`}
                  >
                    {readBtnItem.音标 && (
                      <div className="text-xs text-black/60 -mb-2 -mt-1.5">
                        {dl.yinSoundMark[wordIndex] || (<div className="invisible">音标是空的占位</div>)}
                      </div>
                    )}
                    {readBtnItem.单词 && (
                      <div>{word}</div>
                    )}
                  </div>
                ))}
                {readBtnItem.音频 && (
                  <div
                    className="px-3 cursor-pointer hover:text-primary-900 flex items-center"
                    onClick={() => {
                      const audio = new Audio(dl.mp3);
                      audio.play();
                    }}
                  >
                    <BiSolidUserVoice className="w-5 h-5" />
                  </div>
                )}
                {readBtnItem.中文 && (
                  <div className="leading-4 text-black/70 p-1">
                    {dl.han}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadBook;
