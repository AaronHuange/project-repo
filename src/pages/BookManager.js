import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import { AiOutlineFilter } from 'react-icons/ai';
import { BiBookReader } from 'react-icons/bi';
import { IoIosAddCircleOutline } from 'react-icons/io';
import {
  BsChevronCompactRight, BsChevronDown, BsFilterLeft, BsChevronUp,
} from 'react-icons/bs';
import { RiRefreshLine } from 'react-icons/ri';
import { LiaSearchSolid } from 'react-icons/lia';
import useCreate from '@/hooks/useCreate';
import useToggle from '@/hooks/useToggle';
import Alert from '@/components/modal/Alert';
import { toast } from '@/components/toastify';
import http from '@/config/http';

function BookManager() {
  const { post, loading } = useFetch(http.dev.bookHttp);
  const { post: bookPost, loading: bookLoading } = useFetch(`${http.dev.bookHttp}/pub/bookread`);
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = React.useState('书名');
  const [searchValue, setSearchValue] = React.useState('');
  const [group, setGroup] = React.useState([]);
  const [activeLabel, setActiveLabel] = React.useState('');
  const [activeLabelSelector, setActiveLabelSelector] = React.useState('练气');
  const [bookList, setBookList] = React.useState([]);
  const [isModalOpened, setIsModalOpened] = React.useState(false);
  useCreate(() => {
    setGroup(['全部', '已上架', '未上架', '收费', '免费', '按条件推荐', '推荐到所有用户']);
    setActiveLabel('全部');
    setBookList([]);
  });
  const toggle = useToggle();
  const [newBookItem, setNewBookItem] = React.useState({
    copyrightsSatement: '内容经过PK英语安全团队基于国家法律法规的安全审计，如果您认为包含违规内容，请在【纳戒-已意见反馈】进行举报，我们会第一时间受理。',
    price: '0.00',
  });
  const subTabMapRef = React.useRef({
    经典: [], 小说: [], 演讲: [], 考试: [], 生活: [], 教材: [], 商业: [], 通识: [], 能力提升: [], 实用速成: [], 开阔视野: [], 保持语感: [], 其他: [],
  });
  const subTabListRef = React.useRef([]);
  subTabListRef.current = subTabMapRef[newBookItem.tabName] || [];
  const searchBook = () => {
    let bookName = '';
    let author = '';
    if (searchFilter === '书名') {
      bookName = searchValue;
    } else {
      author = searchValue;
    }
    post('/pub/bookread/searchBooksByFilter', {
      data: {
        bookName, author, filter: activeLabel || '', selector: activeLabelSelector,
      },
    }).then((response) => {
      const { returnCode, data } = response || {};
      if (returnCode !== '0000') {
        // toast.error(returnMessage);
        return;
      }
      setBookList(data.list);
      // const { chapterList, summarySqlBean } = response;
      // currentBookSummaryRef.current = summarySqlBean;
      // if (!chapterList || chapterList.length <= 0) {
      //   Toast.show({ content: '未添加内容,可添加章节' });
      // } else {
      //   currentBookChapterListRef.current = chapterList;
      // }
      // toRefresh(!refresh);
    });
  };
  React.useEffect(() => searchBook(), [activeLabel, activeLabelSelector]);
  const renderSelector = ({
    title, toggleLabel, field, data = [],
  }) => (
    <>
      <div key={`title-${title}`} className="font-medium text-base mt-3 mb-2">
        <span className="text-red-500 mr-0.5">*</span>
        <span>{title}</span>
      </div>
      <div key={`content-${title}`} className="relative group">
        <div
          className={`cursor-pointer input w-full text-sm h-9 flex justify-between items-center ${toggle.toggled(`book/${toggleLabel}`) ? 'border-primary-500' : ''}`}
          onClick={() => toggle.toggle(`book/${toggleLabel}`)}
        >
          <div>{newBookItem[field]}</div>
          {!toggle.toggled(`book/${toggleLabel}`) && <BsChevronDown className={`w-4 h-4 ${toggle.toggled(`book/${toggleLabel}`) ? 'text-primary-500' : ''}`} />}
          {toggle.toggled(`book/${toggleLabel}`) && <BsChevronUp className="w-4 h-4" />}
        </div>
        {toggle.toggled(`book/${toggleLabel}`) && (
          <div className="dropdown">
            {data.map((item, index) => (
              <div
                key={`level-${index * 100}`}
                className="dropdown-item w-60"
                onClick={() => setNewBookItem({ ...newBookItem, [field]: item })}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
  const renderInput = ({
    title, field, type = 'text',
  }) => (
    <>
      <div className="font-medium text-base mt-3 mb-2">
        <span className="text-red-500 mr-0.5">*</span>
        <span>{title}</span>
      </div>
      <input
        type={type}
        className="input w-full text-sm"
        value={newBookItem[field] || ''}
        max={10}
        onChange={(e) => {
          setNewBookItem({ ...newBookItem, [field]: e.target.value });
        }}
      />
    </>
  );
  const isUpdateBookRef = React.useRef(false);
  const updateBookInfoRef = React.useRef({});
  React.useEffect(() => {
    if (!isModalOpened) {
      isUpdateBookRef.current = false;
      updateBookInfoRef.current = {};
      setNewBookItem({
        copyrightsSatement: '内容经过PK英语安全团队基于国家法律法规的安全审计，如果您认为包含违规内容，请在【纳戒-已意见反馈】进行举报，我们会第一时间受理。',
        price: '0.00',
      });
    } else if (isUpdateBookRef.current) {
      setNewBookItem(updateBookInfoRef.current);
    }
  }, [isModalOpened]);
  const addBookModal = isModalOpened ? (
    <Alert
      open
      title={isUpdateBookRef.current ? '修改详情' : '新增书籍'}
      contentWidth="39vw"
      onClose={() => setIsModalOpened(false)}
      loading={bookLoading}
      onConfirm={() => {
        // 尝试新增数据
        bookPost(isUpdateBookRef.current ? '/updateBook' : '/addBook', {
          data: {
            ...newBookItem, forAll: newBookItem.forAll === '推送给所有人',
          },
        }).then((response) => {
          const { returnCode, returnMessage } = response || {};
          if (returnCode !== '0000') {
            toast.error(returnMessage);
            return;
          }
          if (!isUpdateBookRef.current) {
            navigate('/book_edit');
          } else {
            setIsModalOpened(false);
            toast.success('修改成功');
            searchBook();
          }
        });
      }}
    >
      <div className="text-black/50 text-sm -mt-5">
        新增成功后，后期还可以修改下列任意相关设置。
      </div>
      <div className="text-black/50 text-sm"> 当没有预览图片时，组件将会以组件名称进行展示。</div>
      <div className="text-black/50 text-sm mb-5"> 保存组件的类型默认为创建组件时所在栏目的类型。</div>
      {renderInput({ title: '中文书名', field: 'bookName' })}
      {renderInput({ title: '英文书名', field: 'bookEngName' })}
      {renderInput({ title: '作者姓名', field: 'author' })}
      {renderInput({ title: '图书价格(元)', field: 'price', type: 'number' })}
      {renderInput({ title: '书籍介绍', field: 'introduction' })}
      {renderInput({ title: '版权提示', field: 'copyrightsSatement' })}
      {renderInput({ title: '书籍图片', field: 'bookImage' })}
      <div className="flex space-x-12">
        <div className="w-0 flex-1">
          {renderSelector({
            title: '推送设置-是否通用',
            toggleLabel: 'forAll',
            field: 'forAll',
            data: ['推送给所有人', '根据推送设置推送'],
          })}
        </div>
        {newBookItem.forAll !== '推送给所有人' && (
          <div className="w-0 flex-1">
            {renderSelector({
              title: '推送设置-按需推送',
              toggleLabel: 'level',
              field: 'difficultyLevel',
              data: ['练气', '筑基', '结丹', '元婴', '化神', '炼虚', '合体', '大乘', '真仙', '金仙', '太乙', '大罗'],
            })}
          </div>
        )}
      </div>
      <div className="flex space-x-12">
        <div className="w-0 flex-1">
          {renderSelector({
            title: '主栏目设置-类型',
            toggleLabel: 'type',
            field: 'type',
            data: ['经典', '小说', '演讲', '考试', '生活', '教材', '商业', '通识', '能力提升', '实用速成', '开阔视野', '保持语感', '其他'],
          })}
        </div>
        <div className="w-0 flex-1">
          {renderSelector({
            title: '子栏目设置-详细分类',
            toggleLabel: 'difficultyTestLevel',
            field: 'difficultyTestLevel',
            data: ['啊啊'],
          })}
        </div>
      </div>
    </Alert>
  ) : null;
  const unPublish = (book) => {
    bookPost('/unPublish', { data: { id: book.id } }).then((response) => {
      const { returnCode, returnMessage } = response || {};
      if (returnCode !== '0000') {
        toast.error(returnMessage);
        return;
      }
      toast.success('修改成功');
      searchBook();
    });
  };
  const publish = (book) => {
    bookPost('/publish', { data: { id: book.id } }).then((response) => {
      const { returnCode, returnMessage } = response || {};
      if (returnCode !== '0000') {
        toast.error(returnMessage);
        return;
      }
      toast.success('修改成功');
      searchBook();
    });
  };
  return (
    <div className="py-8 px-5">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <BiBookReader className="w-6 h-6" />
          <div className="font-bold text-xl">图书</div>
        </div>
        <div className="flex-1 flex justify-end">
          <div
            className="flex items-center h-10 btn btn-primary bg-primary-500 group hover:bg-primary-600 space-x-2 rounded-md cursor-pointer"
            onClick={ () => setIsModalOpened(true)}
          >
            <IoIosAddCircleOutline className="w-5 h-5" />
            <div className="group-hover:font-medium text-lg">新增书籍</div>
          </div>
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
                '书名', '作者名',
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
            {item === '按条件推荐' && activeLabel === item && (
              <div className="flex items-center space-x-2" onClick={() => toggle.toggle('book/searchFilter')}>
                <div className="text-white/80">: {activeLabelSelector}</div>
                {!toggle.toggled('book/searchFilter') && <BsChevronDown className={`text-white/80 w-4 h-4 ${toggle.toggled('book/searchFilter') ? '!text-primary-500' : ''}`} />}
                {toggle.toggled('book/searchFilter') && <BsChevronUp className="text-white/80 w-4 h-4" />}
                {toggle.toggled('book/searchFilter') && (
                  <div className="dropdown">
                    {['练气', '筑基', '结丹', '元婴', '化神', '炼虚', '合体', '大乘', '真仙', '金仙', '太乙', '大罗'].map((level, levelIndex) => (
                      <div
                        key={`level-filter-${levelIndex * 100}`}
                        className="dropdown-item dropdown-right w-36"
                        onClick={() => setActiveLabelSelector(level)}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-between mt-6 pt-8 border-t border-solid">
        <div className="flex items-center">
          <div className="text-black font-medium cursor-default">总共{bookList?.length || 0}条数据</div>
          <RiRefreshLine onClick={() => searchBook()} className={`ml-3 cursor-pointer text-black hover:text-primary-900 ${loading ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex items-center px-2 py-1 border border-solid border-primary-500 rounded-full">
          <BsFilterLeft className="w-4 h-4 text-primary-500" />
          <div className="px-3 text-black/60">过滤项</div>
          <BsChevronDown className="w-4 h-4 text-primary-500" />
        </div>
      </div>
      <div className="grid grid-cols-3 p-5 gap-5">
        {bookList.map((book, index) => (
          <div
            key={`book-list-${index * 100}`}
            className="bg-white min-w-[390px] shadow shadow-gray-300/60 p-6 rounded-lg"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-14 flex flex-col justify-between">
                  <div className="text-black/50 text-sm">{book.author}</div>
                  <div className="text-lg font-medium">{book.bookName}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {book.price > 0 && (
                    <div className="text-primary-500 my-4 mr-6">
                      ￥{book.price}
                    </div>
                  )}
                  {book.price <= 0 && (
                    <div className="text-black/60 my-4 mr-6">
                      免费
                    </div>
                  )}
                  {book.state === '已上架' && (
                    <div onClick={() => unPublish(book)} className="cursor-pointer bg-primary-500/50 rounded-full px-2 py-0.5 text-primary-900 text-xs">已上架</div>
                  )}
                  {book.state === '未上架' && (
                    <div onClick={() => publish(book)} className="cursor-pointer bg-gray-500/50 rounded-full px-2 py-0.5 text-black/30 text-xs">未上架</div>
                  )}
                  {!!book.type && (
                    <div className="bg-red-50/50 rounded-full px-2 py-0.5 text-black/30 text-xs cursor-default">{book.type}</div>
                  )}
                  {!!book.difficultyTestLevel && (
                    <div className="bg-red-50/50 rounded-full px-2 py-0.5 text-black/30 text-xs cursor-default">{book.difficultyTestLevel}</div>
                  )}
                  {book.forAll && (
                    <div className="bg-red-50/50 rounded-full px-2 py-0.5 text-black/30 text-xs cursor-default">公开</div>
                  )}
                  {!book.forAll && (
                    <div className="bg-red-50/50 rounded-full px-2 py-0.5 text-black/30 text-xs cursor-default">{book.difficultyLevel}</div>
                  )}
                </div>
              </div>
              <img className="w-20 h-24 shadow shadow-gray-300" src={book.bookImage} alt="" />
            </div>
            <p className="text-black/60 text-sm line-clamp-3 text-ellipsis h-14 flex break-words">
              {book.introduction}
            </p>
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-2">
                <div
                  className="rounded-full px-3 py-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-900 hover:text-primary-700 cursor-pointer"
                  onClick={() => {
                    isUpdateBookRef.current = true;
                    updateBookInfoRef.current = book;
                    setIsModalOpened(true);
                  }}
                >
                  修改详情
                </div>
                <div
                  className="rounded-full px-3 py-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-900 hover:text-primary-700 cursor-pointer"
                  onClick={() => navigate('/book_edit', { state: book })}
                >
                  编辑内容
                </div>
              </div>
              <div className="flex items-center cursor-pointer group">
                <Link to="/readbook" state={{ book }} className="text-black/60 group-hover:text-black">
                  阅读本书
                </Link>
                <BsChevronCompactRight className="w-4 h-4 text-black/60 group-hover:text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {addBookModal}
    </div>
  );
}

export default BookManager;
