package com.pkyingyu.spring.sso.utils;


import com.pkyingyu.spring.sso.jwt.enums.TimeUnit;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static Date getChangeDate(int value, TimeUnit timeUnit) {
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

    public static Date getDate(int year, int month, int day, int hour, int minute, int second) {
        LocalDateTime localDateTime = LocalDateTime.of(year, month, day, hour, minute, second);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        return Date.from(zonedDateTime.toInstant());
    }

}
