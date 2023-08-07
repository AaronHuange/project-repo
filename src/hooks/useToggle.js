import {
  useState, useLayoutEffect,
} from 'react';

/**
 * 处理展开/收起下拉菜单的功能，支持页面多个下拉菜单。
 * !!! 注意处理冒泡
 * @usage
 * ```const toggle = useToggle();```
 * ```<button type="button" onClick={(e) => toggle.toggle(id, e)}>...</button>```
 * ```<div className={`dropdown w-28 ${toggle.isToggled(id) ? '' : 'hidden'}`}>...</div>```
 */
function useToggle({ initialToggled = null, initialSelected = null } = {}) {
  const [current, setCurrent] = useState(initialToggled);
  const open = (item) => setCurrent(item);
  const close = () => setCurrent(null);
  const toggle = (item, e) => {
    // 点击显示的div时，handler方法会被触发。导致状态被重置，需要加延迟覆盖那个。要用宏的不能用微的
    // new Promise((res)=>{res()}).then(()=>{
    //   setCurrent(item === current ? null : item);
    // });
    setTimeout(() => {
      setCurrent(item === current ? null : item);
    });
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  };
  console.log('render toggle');
  const toggled = (item) => item === current;
  const [selected, setSelected] = useState(initialSelected);
  const select = (value) => setSelected(value);

  const isSelected = (value) => value === selected;
  const toggleClose = () => setCurrent(null);

  useLayoutEffect(() => {
    const handler = () => {
      setCurrent(null);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      toggle(null);
    };
  }, []);
  //
  return {
    current,
    toggle,
    toggled,
    isToggled: toggled,
    select,
    selected,
    isSelected,
    toggleClose,
    open,
    close,
  };
}

export default useToggle;
