import React from 'react';
import classnames from 'classnames';
import { RiRefreshLine } from 'react-icons/ri';
import { IoCheckmark } from 'react-icons/io5';
import Tooltip from 'rc-tooltip';

/** 用法：<Reload className="cursor-pointer" loading={loading} reload={loadFormData} />  */
function Reload({
  loading, reload, interval = 0, className = '',
}) {
  const [completed, setCompleted] = React.useState(false);
  const [trigged, setTrigged] = React.useState(false);
  //
  React.useEffect(() => {
    if (interval > 0) {
      const timerFetchData = setInterval(() => {
        reload();
      }, interval);
      return () => {
        clearInterval(timerFetchData);
      };
    }
    return () => {
    };
  }, []);
  const timer = React.useRef();
  // willUnMount
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  //
  React.useEffect(() => {
    if (!loading) {
      setCompleted(true);
      if (!timer.current) {
        timer.current = setTimeout(() => {
          setCompleted(false);
          setTrigged(false);
          timer.current = null;
        }, 300);
      }
    }
  }, [loading]);
  //
  return (
    <>
      { completed && trigged && <IoCheckmark className="w-4 h-4" /> }
      { (!completed || !trigged) && (
        <Tooltip overlay="重载数据" prefixCls="lx-tooltip" placement="right">
          <RiRefreshLine
            onClick={ () => {
              if (!loading) {
                setTrigged(true);
                reload();
              }
            } }
            className={ classnames('w-4 h-4', className, loading ? 'animate-spin' : '') }
          />
        </Tooltip>
      ) }
    </>
  );
}

export default Reload;
