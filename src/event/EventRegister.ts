import LxTrack from "@/index";
import AutoCollectField from "@utils/AutoCollectField";
import bubbleDispatch from "@utils/DispatchClickEvent";
import PageHistoryStack from "@/event/PageHistoryStack";

/** 注册浏览器下的各种事件监听处理 */
export class EventRegister {

  /** 注册全局点击事件 */
  static registerClickEvent() {
    if (!LxTrack.config?.heatmap?.enable) return;

    document.addEventListener('click', e => {
      // @ts-ignore
      const target = bubbleDispatch(e.target);
      if (!target) return;
      AutoCollectField.clickEventField(target)
    }, true);
  }

  static registerPageSwitchEvent() {
    this.registerHistoryRouterEvent();
    this.registerNewPageRouterEvent();
  }

  private static registerHistoryRouterEvent() {
    history.pushState = (f => function pushState(...args) {
      const ret = f.apply(history, args);
      window.dispatchEvent(new Event('enterAfter'));
      return ret;
    })(history.pushState);
    history.replaceState = (f => function replaceState(...args) {
      const ret = f.apply(history, args);
      window.dispatchEvent(new Event('enterAfter'));
      return ret;
    })(history.replaceState);
    window.addEventListener('enterAfter', (ret) => {
      PageHistoryStack.push(window.location);
    });
  }

  private static registerNewPageRouterEvent() {
    window.addEventListener('load', () => {
      PageHistoryStack.push(window.location);
    });
  }

}