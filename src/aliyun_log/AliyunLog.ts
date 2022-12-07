import SlsTracker from '@aliyun-sls/web-track-browser';
import LxTrack from "@/index";

const opts = () => {
  const {
    host = 'cn-qingdao.log.aliyuncs.com',
    project = 'lx-track',
    logstore = '',
    time = 10,
    count = 10,
    topic = 'topic',
    source = 'source',
  } = LxTrack.config?.logConfig || {};
  if (!logstore) {
    console.log('上报功能异常：没有设置logstore');
  }
  return {
    host, // 所在地域的服务入口。例如cn-hangzhou.log.aliyuncs.com
    project, // Project名称。
    logstore, // Logstore名称。
    time, // 发送日志的时间间隔，默认是10秒。
    count, // 发送日志的数量大小，默认是10条。
    topic, // 自定义日志主题。
    source,
    tags: {
      tags: 'tags',
    },
  }
}

//上传单条日志
export const sendLog = (obj: Object) => {
  //console.log('sendLog=>', obj)
  const tracker = new SlsTracker(opts())
  tracker.send(obj)
}
// 立即上传单条日志。此时配置time和count参数不生效。
export const sendLogImmediate = (obj: Object) => {
  console.log('sendLogImmediate=>', obj)
  const tracker = new SlsTracker(opts())
  tracker.sendImmediate(obj)
}
// 批量上传日志。
export const sendBatchLogs = (arr: Array<Object>) => {
  console.log('sendBatchLogs=>', arr)
  const tracker = new SlsTracker(opts())
  tracker.sendBatchLogs(arr)
}
// 批量上传日志。此时配置time和count参数不生效
export const sendBatchLogsImmediate = (arr: Array<Object>) => {
  console.log('sendBatchLogsImmediate=>', arr)
  const tracker = new SlsTracker(opts())
  tracker.sendBatchLogsImmediate(arr)
}


// sendLog({
//   test: 'test',
//   _page_id: 'lxcrm-test.weiwenjia.com/new_report_center#/sales/returned_money/rank',
//   _url: 'https://lxcrm-test.weiwenjia.com/new_report_center#/sales/returned_money/rank',
// }, 'buried-test', 'buried-test');

