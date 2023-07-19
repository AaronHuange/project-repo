import dayjs from '@/lib/datetime';

/**
 * 下划线转驼峰
 * @param name
 * @returns {*}
 */
export const underlineToHump = (name) => name.replace(
  /_(\w)/g,
  (all, letter) => letter.toUpperCase()
);

/**
 * 驼峰转下划线
 * @param name
 * @returns {string}
 * @constructor
 */
const humpToUnderline = (name) => name.replace(/([A-Z])/g, '_$1').toLowerCase();

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 驼峰转下划线
 * @param params
 * @returns {{}|*}
 */
export const transferUnderline = (params) => {
  // 函数首次调用判断
  if (!isObject(params)) return params;
  const result = {};
  const keys = Object.keys(params);
  keys.forEach((key) => {
    let newKey = key;
    const value = params[key];
    newKey = humpToUnderline(newKey);
    if (isObject(value)) {
      result[newKey] = transferUnderline(value);
    } else {
      result[newKey] = value;
    }
  });
  return result;
};

/**
 * 计算不同时间类型的 时间区间值
 * @param datetime
 * @param dateType
 * @param YMD
 * @returns {*[]}
 */
export const getDates = (datetime, dateType, YMD = 'YYYY-MM-DD') => {
  const todayDate = datetime.format(YMD);
  const currentMonth = datetime.get('month');
  const currentQuarter = datetime.quarter();
  const returnValues = [];
  // 获取本周一时间
  const currentWeek = datetime.day(1);
  switch (dateType) {
    case 'yesterday': // 今日
      returnValues.push(datetime.add(-1, 'day').format(YMD), datetime.add(-1, 'day').format(YMD));
      break;
    case 'today': // 今日
      returnValues.push(todayDate, todayDate);
      break;
    case 'prevWeek': // 上周
      returnValues.push(
        currentWeek.add(-7, 'day').format(YMD),
        currentWeek.add(-1, 'day').format(YMD)
      );
      break;
    case 'week': // 本周
      returnValues.push(datetime.day(1).format(YMD), datetime.day(7).format(YMD));
      break;
    case 'prevMonth': // 上月
      returnValues.push(
        datetime.date(1).add(-1, 'day').date(1).format(YMD),
        datetime.date(1).add(-1, 'day').format(YMD)
      );
      break;
    case 'month': // 本月
      returnValues.push(
        datetime.date(1).format(YMD),
        datetime.add(1, 'month').date(0).format(YMD)
      );
      break;
    case 'nextMonth': // 下月
      returnValues.push(
        datetime.add(1, 'month').date(1).format(YMD),
        datetime.add(2, 'month').date(0).format(YMD)
      );
      break;
    case 'prevQuarter': // 上季度
      returnValues.push(
        dayjs(new Date(datetime.year(), (currentQuarter - 2) * 3, 1)).format(YMD),
        dayjs(new Date(datetime.year(), (currentQuarter - 1) * 3, 0)).format(YMD)
      );
      break;
    case 'nextQuarter': // 下季度
      returnValues.push(
        dayjs(new Date(datetime.year(), currentQuarter * 3, 1)).format(YMD),
        dayjs(new Date(datetime.year(), (currentQuarter + 1) * 3, 0)).format(YMD)
      );
      break;
    case 'quarter': // 本季度
      // 获取当前月
      if ([0, 1, 2].includes(currentMonth)) {
        returnValues.push(
          datetime.month(0).date(1).format(YMD),
          datetime.month(3).date(0).format(YMD)
        );
      } else if ([3, 4, 5].includes(currentMonth)) {
        returnValues.push(
          datetime.month(3).date(1).format(YMD),
          datetime.month(6).date(0).format(YMD)
        );
      } else if ([6, 7, 8].includes(currentMonth)) {
        returnValues.push(
          datetime.month(6).date(1).format(YMD),
          datetime.month(9).date(0).format(YMD)
        );
      } else {
        returnValues.push(
          datetime.month(9).date(1).format(YMD),
          datetime.month(12).date(0).format(YMD)
        );
      }
      break;
    case 'prevHalfYear': // 上半年
      returnValues.push(
        datetime.month(0).date(1).format(YMD),
        datetime.month(6).date(0).format(YMD)
      );
      break;
    case 'nextHalfYear': // 下半年
      returnValues.push(
        datetime.month(7).date(1).format(YMD),
        datetime.month(12).date(0).format(YMD)
      );
      break;
    case 'lastYear': // 去年
      returnValues.push(
        datetime.add(-1, 'year').month(0).date(1).format(YMD),
        datetime.month(0).date(0).add(-1, 'day')
          .format(YMD)
      );
      break;
    case 'year': // 本年
      returnValues.push(
        datetime.month(0).date(1).format(YMD),
        datetime.add(1, 'year').month(0).date(0).format(YMD)
      );
      break;
    default:
      break;
  }
  return returnValues;
};

/**
 * 时间类型枚举
 * @type {{yesterday: string, week: string, month: string, prevMonth: string, year: string, today: string, prevWeek: string, quarter: string}}
 */
export const DateEnum = {
  yesterday: 'yesterday',
  today: 'today',
  prevWeek: 'prevWeek',
  week: 'week', // 本周
  prevMonth: 'prevMonth',
  month: 'month', // 本月
  nextMonth: 'nextMonth',
  prevQuarter: 'prevQuarter',
  quarter: 'quarter', // 本季度
  nextQuarter: 'nextQuarter', // 下季度
  lastYear: 'lastYear',
  year: 'year',
  prevHalfYear: 'prevHalfYear',
  nextHalfYear: 'nextHalfYear',
};

/**
 * 获取对应时间类型枚举的 时间区间
 * today, week, month, quarter, year
 * @param type
 */
export const getDateDatas = () => {
  const datetime = dayjs();
  return {
    yesterday: {
      value: DateEnum.yesterday,
      values: getDates(datetime, DateEnum.yesterday),
    },
    today: {
      value: DateEnum.today,
      values: getDates(datetime, DateEnum.today),
    },
    prevWeek: {
      value: DateEnum.prevWeek,
      values: getDates(datetime, DateEnum.prevWeek),
    },
    week: {
      value: DateEnum.week,
      values: getDates(datetime, DateEnum.week),
    },
    prevMonth: {
      value: DateEnum.prevMonth,
      values: getDates(datetime, DateEnum.prevMonth),
    },
    month: {
      value: DateEnum.month,
      values: getDates(datetime, DateEnum.month),
    },
    nextMonth: {
      value: DateEnum.nextMonth,
      values: getDates(datetime, DateEnum.nextMonth),
    },
    prevQuarter: {
      value: DateEnum.prevQuarter,
      values: getDates(datetime, DateEnum.prevQuarter),
    },
    quarter: {
      value: DateEnum.quarter,
      values: getDates(datetime, DateEnum.quarter),
    },
    nextQuarter: {
      value: DateEnum.nextQuarter,
      values: getDates(datetime, DateEnum.nextQuarter),
    },
    prevHalfYear: {
      value: DateEnum.prevHalfYear,
      values: getDates(datetime, DateEnum.prevHalfYear),
    },
    nextHalfYear: {
      value: DateEnum.nextHalfYear,
      values: getDates(datetime, DateEnum.nextHalfYear),
    },
    lastYear: {
      value: DateEnum.lastYear,
      values: getDates(datetime, DateEnum.lastYear),
    },
    year: {
      value: DateEnum.year,
      values: getDates(datetime, DateEnum.year),
    },
  };
};

export default {};
