import React from 'react';
import { useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import EveryEdit from '@/pages/page_components/EveryEdit';

function AddEveryday() {
  const { state = {} } = useLocation();
  return (
    <div className="p-5 pr-0 flex min-h-screen">
      <div className="flex-1">
        <div className="btn btn-link cursor-pointer" onClick={() => window.history.back()}>
          <IoIosArrowBack className="w-4 h-4" />
          <div className="text-base">返回</div>
        </div>
        <div className="mt-12 ml-16">
          <EveryEdit line={state?.contentJson} day={state?.day} />
        </div>
      </div>
      {false && (
        <div className="fixed top-1/2 -translate-y-1/2 -right-28">
          <img src="iphone.png" className="w-[620px]" alt="" />
        </div>
      )}
    </div>
  );
}

export default AddEveryday;
