package com.pkyingyu.mp.common.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UtilFormatVerify {

    public static boolean isPhone(String phoneStr) {
        String regex = "^((13[0-9])|(15[0-9])|(18[0-9]))\\d{8}$";
        Pattern p = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(phoneStr);
        return m.matches();
    }




}
