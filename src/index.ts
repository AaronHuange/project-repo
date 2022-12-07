import AutoCollectField from "@utils/AutoCollectField";
import {EventRegister} from "@/event/EventRegister";

export interface ConfigProps {
  logConfig?: {
    host?: string,
    project?: string,
    logstore?: string,
    time?: number,
    count?: number,
    topic?: string,
    source?: string,
  },
  common?: Object,
  autoTrack?: boolean,
  pageIdMapping?: Object;
  keyMapping?: Object;
  heatmap?: {
    enable?: boolean,
    collectTags?: Object,
  },
}

export default class LxTrack {

  /** 初始化时的配置 */
  static config: ConfigProps | null = null;

  static init(config: ConfigProps = {}) {
    LxTrack.config = config;
    const { autoTrack = true } = config || {};
    if (!autoTrack) return;
    EventRegister.registerClickEvent();
    EventRegister.registerPageSwitchEvent();
  };

  /** 手动上报(会自动添加公共字段) */
  static track(object: Object) {
    AutoCollectField.trackEventField(object);
  }

  /** 覆盖或增加某些公共字段 */
  static setConfig(object: Object) {
    AutoCollectField.replaceField = object;
  }

}
