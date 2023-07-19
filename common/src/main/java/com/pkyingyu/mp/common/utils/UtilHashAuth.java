package com.pkyingyu.mp.common.utils;

import java.security.MessageDigest;

// 轻量的授权工具： 通过内部私密key和携带数据的hashcode校验可靠性
public class UtilHashAuth {

    public static String getMD5(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(str.getBytes());
            byte[] hash = md.digest();
            StringBuilder secpwd = new StringBuilder();
            for (int i = 0; i < hash.length; i++) {
                int v = hash[i] & 0xFF;
                if (v < 16) secpwd.append(0);
                secpwd.append(Integer.toString(v, 16));
            }
            return secpwd.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
