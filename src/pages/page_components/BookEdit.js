import React from 'react';
import hash from 'object-hash';
import { useFetch } from 'use-http';
import { IoIosArrowBack, IoIosAddCircleOutline } from 'react-icons/io';
import { VscLoading } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';
import Alert from '@/components/modal/Alert';
import useTableData from '@/components/origin_table/useTableData';
import useQiNiuUpload from '@/hooks/useQiniuUpload';
import { toast } from '@/components/toastify';
import useCreate from '@/hooks/useCreate';
import http from '@/config/http';

function BookEdit() {
  const { post, loading } = useFetch(http.dev.bookHttp);
  const { post: smartMemoryPost } = useFetch(http.dev.smartMemoryHttp);
  const { bookName } = useLocation().state || {};
  const { uploadBookMp3 } = useQiNiuUpload();
  const [isModalOpened, setIsModalOpened] = React.useState(false);
  const [isDlModalOpened, setIsDlModalOpened] = React.useState(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = React.useState(false);
  const [parseWordLoading, setParseWordLoading] = React.useState(false);
  const deleteZjNameRef = React.useRef(null);
  const editDlNameRefRef = React.useRef(null);
  useCreate(() => {
    smartMemoryPost('/pub/smartMemory/getAllWords', {})
      .then((response) => {
        const { data, returnCode } = response || {};
        if (returnCode !== '0000') {
          return;
        }
        if (data.records) {
          const tempWordMap = {};
          data.records?.forEach((wordItem) => {
            tempWordMap[wordItem.word] = wordItem;
          });
          console.log('tempWordMap==', tempWordMap);
          window.wordMapRef = tempWordMap || {};
        }
      });
  });
  console.log('window.wordMapRef==', window.wordMapRef);
  // const editDlCurrentAllDlListRef = React.useRef([]);
  const [editDlCurrentAllDlList, setEditDlCurrentAllDlList] = React.useState([]);
  const editZjOldZjNameRef = React.useRef('');
  const [editZjObject, setEditZjObject] = React.useState({});
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
  const { html, setDatas } = useTableData({
    columns: [
      { name: 'chapter', label: '章节名', type: 'string' },
      { name: 'free', label: '免费阅读', type: 'bool' },
      { name: 'createTime', label: '创建时间', type: 'datetime' },
      {
        name: 'custom',
        label: '操作',
        type: 'custom',
        render: (col, line) => {
          console.log('data', col, line);
          const { chapter, free } = line || {};
          return (
            <div className="flex items-center space-x-2">
              <div
                className="btn btn-outline-secondary cursor-pointer rounded-md text-black/50 hover:text-black hover:font-medium"
                onClick={ () => {
                  getAllDlByZj(chapter, (dlLsit) => {
                    editDlNameRefRef.current = chapter;
                    setEditDlCurrentAllDlList(dlLsit || []);
                    setIsDlModalOpened(true);
                  });
                } }
              >
                编辑段落
              </div>
              <div
                className="btn btn-outline-secondary cursor-pointer rounded-md text-black/50 hover:text-black hover:font-medium"
                onClick={ () => {
                  setIsModalOpened(true);
                  setEditZjObject({ name: chapter, free });
                  editZjOldZjNameRef.current = chapter;
                } }
              >
                编辑章节
              </div>
              <div
                className="btn btn-outline-secondary cursor-pointer rounded-md text-black/50 hover:text-black hover:font-medium"
                onClick={ () => {
                  setIsDeleteModalOpened(true);
                  deleteZjNameRef.current = chapter;
                } }
              >
                删除章节
              </div>
            </div>
          );
        },
      },
    ],
    data: [],
  });
  const getChapterInfo = () => {
    // 获取所有章节信息
    post('/pub/bookread/getAllZj', {
      data: { bookName },
    }).then((response) => {
      const { returnCode, data } = response || {};
      if (returnCode !== '0000') {
        return;
      }
      setDatas(data.list || []);
      console.log(loading);
    });
  };
  const deleteModal = isDeleteModalOpened ? (
    <Alert
      open
      title="确认删除章节?"
      contentWidth="26vw"
      onClose={() => setIsDeleteModalOpened(false)}
      loading={loading}
      onConfirm={() => {
        post('/pub/bookread/deleteZj', {
          data: {
            bookName,
            chapter: deleteZjNameRef.current,
          },
        })
          .then((response) => {
            const { returnCode, returnMessage } = response || {};
            if (returnCode !== '0000') {
              toast.error(returnMessage);
              return;
            }
            toast.success('删除成功');
            setIsDeleteModalOpened(false);
            getChapterInfo();
          });
      }}
    >
      <div className="text-black/50 text-sm -mt-5">删除章节后，会删除章节中相关的所有段落。</div>
      <div className="text-black/50 text-sm"> 删除成功后，将无法恢复所删除的章节。</div>
    </Alert>
  ) : null;
  const [showDlIndexList, setShowDlIndexList] = React.useState([]);
  const fileRef = React.useRef(null);
  console.log('editDlCurrentAllDlListRef.current===', editDlCurrentAllDlList);
  const [refresh, setRefresh] = React.useState(0);
  React.useEffect(() => {
    setRefresh(new Date().getTime());
  }, [hash(showDlIndexList)]);
  const editDlModal = isDlModalOpened ? (
    <Alert
      open
      key={`alert-${refresh}`}
      title="编辑段落"
      contentWidth="66vw"
      onClose={() => setIsDlModalOpened(false)}
      loading={loading}
      displayFooter={false}
      onConfirm={() => {
      }}
    >
      <div className="flex flex-col justify-between -mt-5">
        <div className="max-h-[56vh] overflow-y-auto">
          <div className="flex items-center">
            <span className="text-black/50 text-sm">需要将文字转成mp3,可以尝试使用</span>
            <span className="text-black/50 text-sm cursor-pointer px-2 hover:rounded-md hover:bg-gray-100" onClick={() => window.open('https://ttsmaker.com/')}>ttsmaker</span>
            <span className="text-black/50 text-sm">或</span>
            <span className="text-black/50 text-sm cursor-pointer px-2 hover:rounded-md hover:bg-gray-100" onClick={() => window.open('https://www.zaixianai.cn/voiceCompose')}>voiceCompose</span>
          </div>
          <div className="text-black/50 text-sm"> 开启修改内容开关后,即可编辑相关段落内容。</div>
          <div className="text-black/50 text-sm"> 输入原英文后点击解析原英文,将自动填写单词、英式、美式输入框内容。</div>
          <div className="text-black/50 text-sm mb-5"> 可以手动修改无法正确解析的音标,点击保存修改保存编辑内容。</div>
          {editDlCurrentAllDlList.map((node, index) => (
            <div key={`get-all-dl-${index * 100}`}>
              <div className="flex items-center justify-between mt-3 mb-2">
                <div className="flex items-center font-medium text-base">
                  <span className="text-red-500 mr-1">*</span>
                  <span>段落{index + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-200/50 hover:bg-gray-500/50 space-x-5 border rounded-md px-2 py-px">
                    <div className="text-base">
                      <span>修改内容</span>
                    </div>
                    <div className="toggle toggle-xs ml-auto">
                      <input
                        type="checkbox"
                        name="toggle"
                        id={`toggle-tpl-free-${index}`}
                        className="toggle-checkbox text-[#333] text-sm"
                        checked={showDlIndexList.includes(`${index}`)}
                        onChange={() => {
                          // 设置输入框的值
                          console.log('设置输入框的值 editDlCurrentAllDlList:', editDlCurrentAllDlList[index]);
                          // 控制开关
                          const tempShowDlIndexList = [...showDlIndexList];
                          if (tempShowDlIndexList.includes(`${index}`)) {
                            tempShowDlIndexList.splice(tempShowDlIndexList.findIndex((item) => item === `${index}`), 1);
                            setShowDlIndexList(tempShowDlIndexList);
                            return;
                          }
                          tempShowDlIndexList.push(`${index}`);
                          setShowDlIndexList(tempShowDlIndexList);
                        }}
                      />
                      <label htmlFor={`toggle-tpl-free-${index}`} className="toggle-label w-7" />
                    </div>
                  </div>
                  <div
                    className="cursor-pointer bg-gray-200/50 hover:bg-gray-500/50 rounded-md px-2 py-px"
                    onClick={() => {
                      const { timestamp, chapter, yin } = editDlCurrentAllDlList[index] || {};
                      console.log('editDlCurrentAllDlList[index]====:', editDlCurrentAllDlList[index]);
                      const yinSoundMark = document.getElementById(`textarea-yin-sound-mark-${index}`).value.split(',');
                      const meiSoundMark = document.getElementById(`textarea-mei-sound-mark-${index}`).value.split(',');
                      const han = document.getElementById(`textarea-chinese-${index}`).value;
                      const mp3 = document.getElementById(`textarea-mp3-${index}`).value;
                      post('/pub/bookread/saveDl', {
                        data: {
                          yinSoundMark: yinSoundMark?.join('片'),
                          meiSoundMark: meiSoundMark?.join('片'),
                          yin: yin?.join('片'),
                          han,
                          mp3,
                          timestamp,
                          bookName,
                          chapter,
                        },
                      })
                        .then((response) => {
                          const { returnCode, returnMessage } = response || {};
                          if (returnCode !== '0000') {
                            toast.error(returnMessage);
                            return;
                          }
                          // 设置状态
                          const tempEditDlCurrentAllDlList = [...editDlCurrentAllDlList];
                          tempEditDlCurrentAllDlList[index] = {
                            ...tempEditDlCurrentAllDlList[index], yinSoundMark, meiSoundMark, han, mp3,
                          };
                          setEditDlCurrentAllDlList(tempEditDlCurrentAllDlList);
                          toast.success('保存成功');
                        });
                    }}
                  >
                    保存修改
                  </div>
                  <div
                    className="cursor-pointer bg-gray-200/50 hover:bg-gray-500/50 rounded-md px-2 py-px"
                    onClick={() => {
                      setParseWordLoading(true);
                      // 边界判断
                      const originYinElement = document.getElementById(`textarea-origin-${index}`);
                      if (!originYinElement) {
                        toast.error('没有开启修改内容');
                        setParseWordLoading(false);
                        return;
                      }
                      const originYin = originYinElement.value;
                      if (!originYin) {
                        toast.error('原英文为空');
                        setParseWordLoading(false);
                        return;
                      }
                      const yinArray = originYin.split(' ');
                      // 匹配出英式音标和美式音标,匹配失败的使用 ??? 表示
                      const yinSoundMarkArray = [];
                      const meiSoundMarkArray = [];
                      const noAddedWord = [];
                      yinArray.forEach((originWord) => {
                        const word = originWord.replace(/[^a-zA-Z]/g, ''); // 都转成小写进行查找添加
                        if (window.wordMapRef[word] || window.wordMapRef[word.toLowerCase()]) {
                          let currentWord = window.wordMapRef[word];
                          if (!currentWord) {
                            currentWord = window.wordMapRef[word.toLowerCase()];
                          }
                          yinSoundMarkArray.push(currentWord.english_style_soundmark?.replace(/\[/g, '').replace(/\]/g, '').replace(' ', ''));
                          meiSoundMarkArray.push(currentWord.american_style_soundmark?.replace(/\[/g, '').replace(/\]/g, '').replace(' ', ''));
                        } else {
                          noAddedWord.push(word.toLowerCase());
                          yinSoundMarkArray.push('???');
                          meiSoundMarkArray.push('???');
                        }
                      });
                      // TODO 请求词库没有的词
                      // 同步到状态
                      const tempEditDlCurrentAllDlList = [...editDlCurrentAllDlList];
                      tempEditDlCurrentAllDlList[index].yin = yinArray;
                      tempEditDlCurrentAllDlList[index].yinSoundMark = yinSoundMarkArray;
                      tempEditDlCurrentAllDlList[index].meiSoundMark = meiSoundMarkArray;
                      console.log('tempEditDlCurrentAllDlList===', tempEditDlCurrentAllDlList);
                      setEditDlCurrentAllDlList(tempEditDlCurrentAllDlList);
                      // 同步到dom
                      document.getElementById(`textarea-word-${index}`).value = yinArray;
                      document.getElementById(`textarea-yin-sound-mark-${index}`).value = yinSoundMarkArray;
                      document.getElementById(`textarea-mei-sound-mark-${index}`).value = meiSoundMarkArray;
                      // TODO 尝试解析将当前词库不认识的单词
                      setParseWordLoading(false);
                    }}
                  >
                    解析原英文
                  </div>
                  <div
                    className={`cursor-pointer bg-gray-200/50 hover:bg-gray-500/50 rounded-md px-2 py-px ${editDlCurrentAllDlList[index]?.addZj ? 'invisible' : ''}`}
                    onClick={() => {
                      post('/pub/bookread/deleteDL', {
                        data: {
                          bookName,
                          chapter: editDlCurrentAllDlList[index]?.chapter,
                          timestamp: editDlCurrentAllDlList[index]?.timestamp,
                        },
                      })
                        .then((response) => {
                          const { returnCode, returnMessage } = response || {};
                          if (returnCode !== '0000') {
                            toast.error(returnMessage);
                            return;
                          }
                          editDlCurrentAllDlList?.splice(index, 1);
                          toast.error('删除成功');
                        });
                    }}
                  >
                    删除段落
                  </div>
                </div>
              </div>
              {showDlIndexList.includes(`${index}`) && (
                <div className="w-full">
                  <textarea
                    id={`textarea-origin-${index}`}
                    className="border p-2 w-full"
                    placeholder="请输入原英文"
                    rows="6"
                  />
                  <textarea
                    id={`textarea-word-${index}`}
                    className="border p-2 w-full"
                    disabled
                    defaultValue={editDlCurrentAllDlList[index].yin}
                    placeholder="单词数组(不可编辑。点击 解析原英文 按钮自动解析英文)"
                    rows="6"
                  />
                  <textarea
                    id={`textarea-yin-sound-mark-${index}`}
                    defaultValue={editDlCurrentAllDlList[index].yinSoundMark}
                    className="border p-2 w-full"
                    placeholder="英式音标数组(点击 解析原英文 按钮自动解析英文)"
                    rows="6"
                  />
                  <textarea
                    id={`textarea-mei-sound-mark-${index}`}
                    defaultValue={editDlCurrentAllDlList[index].meiSoundMark}
                    className="border p-2 w-full"
                    placeholder="美式音标数组(点击 解析原英文 按钮自动解析英文)"
                    rows="6"
                  />
                  <textarea
                    id={`textarea-chinese-${index}`}
                    defaultValue={editDlCurrentAllDlList[index].han}
                    className="border p-2 w-full"
                    placeholder="请输入中文翻译"
                    rows="6"
                  />
                  <div className="flex space-x-3">
                    <textarea
                      id={`textarea-mp3-${index}`}
                      defaultValue={editDlCurrentAllDlList[index].mp3}
                      className="border p-2 flex-1 w-0"
                      placeholder="请输入mp3链接"
                      rows="1"
                    />
                    <div className="btn w-fit px-3 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-200" onClick={() => fileRef.current?.click()}>上传文件</div>
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      onChange={(file) => {
                        console.log('file::::', file);
                        const { files = [] } = file?.target || {};
                        if (files.length > 1) {
                          toast.error('只能选择一个文件');
                          return;
                        }
                        if (files.length <= 0) {
                          toast.error('请选择文件');
                          return;
                        }
                        const fileObj = files[0];
                        if (fileObj.type !== 'audio/mpeg') {
                          toast.error('请选择mp3文件');
                          return;
                        }
                        const {
                          chapter,
                          timestamp,
                        } = editDlCurrentAllDlList[index] || {};
                        if (!chapter || !timestamp) {
                          toast.error('获取段落失败');
                          return;
                        }
                        const fileName = `${chapter}${timestamp}.mp3`; // 音频文件的命名格式
                        uploadBookMp3({
                          file: fileObj,
                          bookName,
                          fileName,
                          onError: (error) => {
                            console.log('onError', error);
                            toast.error('上传失败');
                          },
                          onSuccess: (res) => {
                            console.log('onSuccess', res);
                            toast.success('上传成功');
                            const { key } = res || {};
                            const url = `http://qiniu.pkyingyu.com/${key}`;
                            editDlCurrentAllDlList[index].mp3 = url;
                            // 刷新界面
                            setEditDlCurrentAllDlList([...editDlCurrentAllDlList]);
                            // 设置DOM
                            document.getElementById(`textarea-mp3-${index}`).value = `textarea-mp3-${index}`;
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 border-t h-14 items-center">
          <div className="flex items-center space-x-2">
            <div
              className="text-black/70 hover:text-black text-sm cursor-pointer"
              onClick={() => {
                // 添加一个段落
                // TODO 弹窗提示，未保留数据将会丢失，是否继续？
                post('/pub/bookread/addDl', {
                  data: {
                    bookName,
                    chapter: editDlNameRefRef.current,
                  },
                })
                  .then((response) => {
                    const { data, returnCode, returnMessage } = response || {};
                    if (returnCode !== '0000') {
                      toast.error(returnMessage);
                      return;
                    }
                    setEditDlCurrentAllDlList(data.dlList || []);
                  });
              }}
            >
              添加段落
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-full ml-2 h-9 !px-5 text-xs"
              onClick={() => setIsDlModalOpened(false)}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary rounded-full ml-2 h-9 !px-5 text-xs"
              onClick={() => setIsDlModalOpened(false)}
              disabled={loading}
            >
              {loading ? <VscLoading className="animate-spin w-4 h-4 text-base" /> : '确认'}
            </button>
          </div>
        </div>
      </div>
    </Alert>
  ) : null;
  const editZJModal = isModalOpened ? (
    <Alert
      open
      title="编辑章节"
      contentWidth="39vw"
      onClose={() => setIsModalOpened(false)}
      loading={loading}
      onConfirm={() => {
        if (!editZjObject.name) {
          toast.error('章节名不能为空');
          return;
        }
        if (!bookName) {
          toast.error('图书名不能为空');
          return;
        }
        post('/pub/bookread/updateZj', {
          data: {
            bookName,
            oldChapter: editZjOldZjNameRef.current || '',
            chapter: editZjObject.name,
            free: editZjObject.free,
          },
        })
          .then((response) => {
            const { returnCode, returnMessage } = response || {};
            if (returnCode !== '0000') {
              toast.error(returnMessage);
              return;
            }
            setIsModalOpened(false);
            getChapterInfo();
          });
      }}
    >
      <div className="text-black/50 text-sm -mt-5">
        新增成功后，后期还可以修改下列任意相关设置。
      </div>
      <div className="text-black/50 text-sm"> 当没有预览图片时，组件将会以组件名称进行展示。</div>
      <div className="text-black/50 text-sm mb-5"> 保存组件的类型默认为创建组件时所在栏目的类型。</div>
      <div className="font-medium text-base mt-3 mb-2">
        <span className="text-red-500 mr-0.5">*</span>
        <span>章节名</span>
      </div>
      <input
        type="text"
        className="input w-full text-sm"
        value={editZjObject.name}
        max={10}
        onChange={(e) => {
          setEditZjObject({ ...editZjObject, name: e.target.value });
        }}
      />
      <div className="flex items-center space-x-5">
        <div className="font-medium text-base mt-3 mb-2">
          <span className="text-red-500 mr-0.5">*</span>
          <span>是否免费</span>
        </div>
        <div className="toggle toggle-xs ml-auto">
          <input
            type="checkbox"
            name="toggle"
            id="toggle-tpl-free"
            className="toggle-checkbox text-[#333] text-sm"
            checked={editZjObject.free || ''}
            onChange={() => setEditZjObject({ ...editZjObject, free: !editZjObject.free })}
          />
          <label htmlFor="toggle-tpl-free" className="toggle-label w-7" />
        </div>
      </div>
    </Alert>
  ) : null;
  const [isZJModalOpened, setIsZJModalOpened] = React.useState(false);
  const [addZJItem, setAddZJItem] = React.useState({});
  const addZJModal = isZJModalOpened ? (
    <Alert
      open
      title="新增章节"
      contentWidth="39vw"
      onClose={() => setIsZJModalOpened(false)}
      loading={false}
      onConfirm={() => {
        if (!addZJItem.name) {
          toast.error('章节名不能为空');
          return;
        }
        if (!bookName) {
          toast.error('图书名不能为空');
          return;
        }
        post('/pub/bookread/addZj', {
          data: {
            bookName,
            chapter: addZJItem.name,
            free: addZJItem.free,
          },
        })
          .then((response) => {
            const { returnCode, returnMessage, data } = response || {};
            if (returnCode !== '0000') {
              toast.error(returnMessage);
              return;
            }
            setIsZJModalOpened(false);
            setDatas(data.chapterList || []);
          });
      }}
    >
      <div className="text-black/50 text-sm -mt-5">
        新增成功后，后期还可以修改下列任意相关设置。
      </div>
      <div className="text-black/50 text-sm"> 当没有预览图片时，组件将会以组件名称进行展示。</div>
      <div className="text-black/50 text-sm mb-5"> 保存组件的类型默认为创建组件时所在栏目的类型。</div>
      <div className="font-medium text-base mt-3 mb-2">
        <span className="text-red-500 mr-0.5">*</span>
        <span>章节名</span>
      </div>
      <input
        type="text"
        className="input w-full text-sm"
        value={addZJItem.name}
        max={10}
        onChange={(e) => {
          setAddZJItem({ ...addZJItem, name: e.target.value });
        }}
      />
      <div className="flex items-center space-x-5">
        <div className="font-medium text-base mt-3 mb-2">
          <span className="text-red-500 mr-0.5">*</span>
          <span>是否免费</span>
        </div>
        <div className="toggle toggle-xs ml-auto">
          <input
            type="checkbox"
            name="toggle"
            id="toggle-tpl-free"
            className="toggle-checkbox text-[#333] text-sm"
            checked={addZJItem.free || ''}
            onChange={() => setAddZJItem({ ...addZJItem, free: !addZJItem.free })}
          />
          <label htmlFor="toggle-tpl-free" className="toggle-label w-7" />
        </div>
      </div>
    </Alert>
  ) : null;

  React.useEffect(() => {
    getChapterInfo();
  }, []);
  return (
    <div className="p-5 flex min-h-screen">
      <div className="flex-1">
        <div
          className="btn btn-link cursor-pointer"
          onClick={ () => window.history.back() }
        >
          <IoIosArrowBack className="w-4 h-4" />
          <div className="text-base">返回</div>
        </div>
        <div className="mt-6 p-5 bg-white rounded-lg">
          <div className="mb-5 flex justify-between">
            <div className="font-medium text-lg">
              { bookName }
            </div>
            <div
              className="cursor-pointer flex items-center space-x-1 group"
              onClick={() => setIsZJModalOpened(true)}
            >
              <IoIosAddCircleOutline className="w-5 h-5 text-black/70 group-hover:text-black" />
              <div className="text-black/70 group-hover:text-black">新增章节</div>
            </div>
          </div>
          {html}
        </div>
      </div>
      {editDlModal}
      {editZJModal}
      {addZJModal}
      {deleteModal}
      {parseWordLoading && (
        <div className="fixed z-[2000] inset-0 bg-gray-300/30 p-4 text-center flex items-center justify-center">
          <div className="pr-2 text-black">
            解析中...
          </div>
          <VscLoading className="animate-spin w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export default BookEdit;
