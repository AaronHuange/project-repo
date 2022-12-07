import LxTrack from "@/index";
import {getXPath} from "@utils/DomXPath";
import {sendLog} from "@/aliyun_log/AliyunLog";

/*** 上报的字段整理 ***/
export default class AutoCollectField {

  /** 自定义的公共字段的 代替字段集 */
  static replaceField: Object | null = null

  /** 所有事件,公共字段整理 */
  private static commonField(): Object {
    const currentPath = `${location.host}${location.pathname}${location.hash}`;
    const {pageIdMapping = {}} = LxTrack.config || {};
    const per: any = window.performance
    const _memory = per?.memory?.usedJSHeapSize;
    const date = new Date();
    const dateStr = date.toLocaleString('chinese', {hour12: false});
    // @ts-ignore
    const _page_id = pageIdMapping[currentPath] || currentPath;
    return {
      _page_id,
      _memory: `${(_memory / 1024 / 1024).toFixed(0)}MB`,
      _url: location.href,
      _title: document.title,
      _os: navigator.userAgent.toLowerCase(),
      _via_at: dateStr,
      ...(LxTrack.config?.common || {})
    };
  }

  /** 点击事件事件,字段整理 */
  static clickEventField(target: any) {
    let _key = getXPath(target).toLowerCase();
    // @ts-ignore target
    _key = LxTrack.config?.keyMapping?.[_key] || _key;
    const {tagName: _el_tag = '', innerText: _el_text = '', type = ''} = target;
    let specialTag = {};
    if (_el_tag === 'A') {
      specialTag = {_link_href: target.href};
    }
    if (_el_tag === 'INPUT' && type === 'checkbox') {
      specialTag = {_input_type: '多选'};
    }
    if (_el_tag === 'INPUT' && type === 'radio') {
      specialTag = {_input_type: '单选'};
    }

    const data = {
      _event: 'click',
      _key,
      _el_tag,
      _el_text: _el_text?.length > 50 ? _el_text.substring(0, 49) : _el_text,
      ...specialTag,
      ...AutoCollectField.commonField(),
      ...(AutoCollectField.replaceField || {}),
    }
    sendLog(data);
  }

  /** 页面进入事件,字段整理 */
  static trackPvEventField(previousPageId: string) {
    setTimeout(() => {
      const per = window.performance;
      const _render_time = per.timing.domComplete - per.timing.domLoading;
      const connectTime = per.timing.connectEnd - per.timing.connectStart;
      const responseTime = per.timing.responseEnd - per.timing.responseStart;

      const {pageIdMapping = {}} = LxTrack.config || {};
      // @ts-ignore
      const _referer_page_id = pageIdMapping[previousPageId] || previousPageId;
      const _referer_url = '';
      const data = {
        _event: 'pv',
        _render_time: `${(_render_time / 1000).toFixed(0)}s`,
        _request_time: `${(connectTime + responseTime).toFixed(0)}s`,
        _referer_page_id,
        _referer_url,
        ...AutoCollectField.commonField(),
        ...(AutoCollectField.replaceField || {}),
      };
      sendLog(data);
    }, 500);
    AutoCollectField.enterTime = new Date().getTime();
  }

  /** 页面退出事件,字段整理 */
  static trackPageLeaveEventField() {
    const data = {
      _event: 'pageLeave',
      ...AutoCollectField.commonField(),
      ...(AutoCollectField.replaceField || {}),
    };
    sendLog(data);
  }

  private static enterTime = 0;

  /** 页面停留时间计算事件时,字段整理 */
  static trackPageStayEventField() {
    // 计算页面停留
    const data = {
      _event: 'pageStay',
      _stay_time: ((new Date().getTime() - AutoCollectField.enterTime) / 1000).toFixed(0),
      ...AutoCollectField.commonField(),
      ...(AutoCollectField.replaceField || {}),
    };
    sendLog(data);
  }

  /** 手动上报类型事件,字段整理 */
  static trackEventField(object: Object, eventName: string = 'custom') {
    const data = {
      _event: eventName,
      ...AutoCollectField.commonField(),
      ...(AutoCollectField.replaceField || {}),
      ...object
    }
    sendLog(data);
  }

}