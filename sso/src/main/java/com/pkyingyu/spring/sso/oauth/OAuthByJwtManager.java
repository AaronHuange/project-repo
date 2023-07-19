package com.pkyingyu.spring.sso.oauth;

import com.pkyingyu.spring.sso.oauth.entities.enums.OAuthResult;
import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.util.Date;

/**
 *
 */
public class OAuthByJwtManager {
    private static String OAUTH_SIGN = "PKOAUTH_SIGNPK";

    public static String getOauthSign() {
        return OAUTH_SIGN;
    }

    public static void setOauthSign(String mOAUTH_SIGN) {
        OAUTH_SIGN = mOAUTH_SIGN;
    }

    public static String getOAuthCode(String phone, String verifyCode, long when) {
        return getMd5(phone + verifyCode + when + OAUTH_SIGN);
    }

    public static OAuthResult verifyOAuthCode(String phone, String verifyCode, long when, String oauthCode) {
        if (StringUtils.isEmpty(oauthCode)) {
            return OAuthResult.FAIL;
        }
        //如何使这个过期,
        if (new Date().getTime() - when > 0) {
            return OAuthResult.EXPIET; //过期
        }

        if (!oauthCode.equals(getMd5(phone + verifyCode + when + OAUTH_SIGN))) {
            return OAuthResult.FAIL;
        }

        return OAuthResult.SUCCESS;
    }

    /********************* md5 *********************/
    private static MessageDigest md5;

    static {
        try {
            md5 = MessageDigest.getInstance("MD5");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String getMd5(String string) {
        try {
            byte[] bs = md5.digest(string.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(40);
            for (byte x : bs) {
                if ((x & 0xff) >> 4 == 0) {
                    sb.append("0").append(Integer.toHexString(x & 0xff));
                } else {
                    sb.append(Integer.toHexString(x & 0xff));
                }
            }
            return sb.toString();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

}
