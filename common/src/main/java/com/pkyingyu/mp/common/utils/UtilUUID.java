package com.pkyingyu.mp.common.utils;

import java.util.UUID;

public class UtilUUID {
    public static String get() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
