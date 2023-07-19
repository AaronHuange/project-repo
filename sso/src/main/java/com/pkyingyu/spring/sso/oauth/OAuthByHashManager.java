package com.pkyingyu.spring.sso.oauth;

import com.pkyingyu.spring.sso.oauth.entities.enums.OAuthResult;

import java.util.Date;

/**
 * 通过比较hash值来验证jwt
 */
public class OAuthByHashManager {
    private static String OAUTH_SIGN = "PKOAUTH_SIGNPK";

    public static String getOauthSign() {
        return OAUTH_SIGN;
    }

    public static void setOauthSign(String mOAUTH_SIGN) {
        OAUTH_SIGN = mOAUTH_SIGN;
    }

    public static int getHashOAuthCode(String phone, String verifyCode, long when) {
        return (phone + verifyCode + when + OAUTH_SIGN).hashCode();
    }

    public static OAuthResult verifyHashOAuthCode(String phone, String verifyCode, long when, int oauthCode) {
        //如何使这个过期
        if (new Date().getTime() - when > 0) {
            return OAuthResult.EXPIET; //过期
        }

        if (oauthCode != (phone + verifyCode + when + OAUTH_SIGN).hashCode()) {
            return OAuthResult.FAIL;
        }
        return OAuthResult.SUCCESS;
    }

}
