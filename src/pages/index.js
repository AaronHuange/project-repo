import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { AiFillHome, AiFillBulb } from 'react-icons/ai';
import { BiSolidTime } from 'react-icons/bi';
import {
  BsFillBookFill, BsFillPatchQuestionFill, BsFillShieldLockFill, BsTicketPerforatedFill,
} from 'react-icons/bs';
import { GiPlanetCore } from 'react-icons/gi';
import { MdFeedback, MdLocalActivity, MdSecurityUpdate } from 'react-icons/md';
import { FaUserAstronaut, FaTable } from 'react-icons/fa';
import useCreate from '@/hooks/useCreate';
import Dashboard from '@/pages/Dashboard';
import EveryDay from '@/pages/EveryDay';
import EnglishManager from '@/pages/EnglishManager';
import BookManager from '@/pages/BookManager';
import QuestionBank from '@/pages/QuestionBank';
import AddEveryday from '@/pages/AddEveryday';
import BookEdit from '@/pages/page_components/BookEdit';
import ReadBook from '@/pages/ReadBook';
import Functions from '@/pages/Functions';

function Home() {
  const [menus, setMenus] = React.useState([]);
  const [currentRouteName, setCurrentRouteName] = React.useState('仪表盘');
  useCreate(() => {
    setMenus([
      { name: '仪表盘', Icon: AiFillHome, path: '/dashboard' },
      { name: '活动弹窗', Icon: MdLocalActivity, path: '/everyday' },
      { name: '每日一句', Icon: BiSolidTime, path: '/everyday' },
      { name: '英语角', Icon: GiPlanetCore, path: '/englishmanager' },
      { name: '图书', Icon: BsFillBookFill, path: '/bookmanager' },
      { name: '功能孵化', Icon: AiFillBulb, path: '/functions' },
      { name: '题库', Icon: BsFillPatchQuestionFill, path: '/questionbank' },
      { name: '优惠卷', Icon: BsTicketPerforatedFill, path: '/voucher' },
      { name: '用户分析', Icon: FaUserAstronaut, path: '#' },
      { name: '用户反馈', Icon: MdFeedback, path: '#' },
      { name: '报表中心', Icon: FaTable, path: '#' },
      { name: '应用更新', Icon: MdSecurityUpdate, path: '#' },
      { name: '权限', Icon: BsFillShieldLockFill, path: '/permission' },
    ]);
  });
  return (
    <div className="flex w-full h-screen">
      <div className="">
        <div className="space-x-1 pt-8 pb-12 flex items-center justify-center w-full text-center">
          <img className="w-6 h-6 rounded-md" src="https://m.360buyimg.com/babel/jfs/t1/169380/20/33131/1642/638c2a48Ec06df082/9e50ac6d345e11da.png" alt="icon" />
          <div className="font-bold text-xl cursor-default flex items-center">
            PK英语
            <span className="w-1.5 h-1.5 mx-1 bg-black rounded-full" />
            <span className="text-sm font-normal flex justify-center items-center">管理端</span>
          </div>
        </div>
        { menus.map((item, index) => {
          const { Icon, name, path } = item;
          return (
            <Link
              to={path}
              key={ `menu-${index * 100}` }
              onClick={ () => setCurrentRouteName(name) }
              className={`relative hover:bg-gray-200 py-3 cursor-pointer pl-8 pr-14 flex items-center space-x-2 text-black/70 ${currentRouteName === name ? 'text-orange-550' : ''}`}
            >
              <Icon className={`w-5 h-5 text-primary-900 ${currentRouteName === name ? 'text-orange-550' : ''}`} />
              <div className="">{ name }</div>
              {currentRouteName === name && (
                <div className="absolute w-6 h-full pl-2 flex justify-center items-center right-0 bg-gray-100 rounded-l-full">
                  <div className="bg-orange-550 w-2 h-2 rounded-md" />
                </div>
              )}
            </Link>
          );
        }) }
      </div>
      <div className="flex-1 bg-gray-100 overflow-auto">
        <Routes>
          <Route end path="/dashboard" element={<Dashboard />} />
          <Route end path="/everyday" element={<EveryDay type="form" />} />
          <Route end path="/englishmanager" element={<EnglishManager />} />
          <Route end path="/bookmanager" element={<BookManager />} />
          <Route end path="/questionbank" element={<QuestionBank />} />
          <Route end path="/permission" element={<Dashboard />} />
          <Route end path="/add_everyday" element={<AddEveryday />} />
          <Route end path="/book_edit" element={<BookEdit />} />
          <Route end path="/functions" element={<Functions />} />
          <Route end path="/readbook" element={<ReadBook />} />
          <Route end path="/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
