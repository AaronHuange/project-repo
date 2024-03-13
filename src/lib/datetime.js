import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekday from 'dayjs/plugin/weekday';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import cn from 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.extend(quarterOfYear);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale(cn);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(utc);

function isCurrentYear(date) {
  return dayjs().year === dayjs(date).year;
}

/**
 * 可读性高的时间串
 * - 今天或者昨天，不显示年月日
 * - 今年不显示年份
 * @param {string|date} date
 * @returns {string} 最终的串，比如：今天 18:03
 */
function humble(date) {
  const object = dayjs(date);
  let start = '';
  const end = object.format('HH:mm');

  if (object.isToday()) {
    start = '今天';
  }

  if (object.isYesterday()) {
    start = '昨天';
  }

  if (start === '') {
    start = object.format(isCurrentYear(date) ? 'MM-DD' : 'YYYY-MM-DD');
  }
  return `${start} ${end}`;
}

//
function full(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function full2(date) {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
}

export default dayjs;
export {
  humble,
  full,
  isCurrentYear,
  cn,
};
