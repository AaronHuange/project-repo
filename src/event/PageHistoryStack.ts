import AutoCollectField from "@utils/AutoCollectField";

/**
 * 页面栈: 1.记录有效的页面(当页面和顶层页面相同时,当做无效页面)
 *        2.触发对应事件上报
 */
export default class PageHistoryStack {
  private static pageStack = new Array<string>();

  static push(location: Location) {
    const currentPageId = `${location.host}${location.pathname}${location.hash}`;
    // 第一次进入该页面 或 刷新了该页面
    if (PageHistoryStack.pageStack.length <= 0) {
      PageHistoryStack.pageStack.push(currentPageId);
      AutoCollectField.trackPvEventField('');
      return;
    }

    // 无效的进入事件(同一页面)
    const previousPageId = PageHistoryStack.pageStack[PageHistoryStack.pageStack.length - 1];
    if (previousPageId === currentPageId) {
      return;
    }
    // 进入新页面
    PageHistoryStack.pageStack.push(currentPageId);
    // 前一页面离开事件
    AutoCollectField.trackPageLeaveEventField();
    // 前以页面停留时间计算
    AutoCollectField.trackPageStayEventField();
    // 新页面进入事件
    AutoCollectField.trackPvEventField(previousPageId);
  }

}
