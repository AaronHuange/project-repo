package com.pkyingyu.mp.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UtilDateTime {

    private static final String dataFormatString = "yyyy-MM-dd HH:mm:ss:SSSS";

    public static String date2String(Date date) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(dataFormatString);
        return simpleDateFormat.format(date);
    }

    public static long string2DateLong(String dateString) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(dataFormatString);
        Date date = null;
        try {
            date = simpleDateFormat.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        if (date == null) {
            return 0;
        }
        return date.getTime();
    }

}
