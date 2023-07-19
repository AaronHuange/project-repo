package com.pkyingyu.mp.common.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;

/*** 时间工具类 ***/
public class UtilDate {

    /**
     * 获取当前时间 以TimeUnit为单位变化value的时间
     *
     * @param value    变化值
     * @param timeUnit 变化单位
     * @return 变化后的时间
     */
    public static Date getChangeDate(int value, UnitTime timeUnit) {
        Calendar now = Calendar.getInstance();
        switch (timeUnit) {
            case DAYS:
                now.add(Calendar.DAY_OF_MONTH, value);
                return now.getTime();
            case HOURS:
                now.add(Calendar.HOUR_OF_DAY, value);
                return now.getTime();
            case MINUTES:
                now.add(Calendar.MINUTE, value);
                return now.getTime();
            case SECONDS:
                now.add(Calendar.SECOND, value);
                return now.getTime();
            case MILLISECONDS:
                now.add(Calendar.MILLISECOND, value);
                return now.getTime();
            default:
                return now.getTime();
        }
    }

    /***
     * 根据 年月日时分秒 获取时间
     * @param year
     * @param month
     * @param day
     * @param hour
     * @param minute
     * @param second
     * @return
     */
    public static Date getDate(int year, int month, int day, int hour, int minute, int second) {
        LocalDateTime localDateTime = LocalDateTime.of(year, month, day, hour, minute, second);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        return Date.from(zonedDateTime.toInstant());
    }

}
