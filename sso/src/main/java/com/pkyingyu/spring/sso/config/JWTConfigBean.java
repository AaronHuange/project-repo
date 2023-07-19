package com.pkyingyu.spring.sso.config;


/**
 * ssoconfig.properties
 * <p>
 * #字符串值不要用双引号括起来
 * pkyingyu.sso.jwtMd5Sign=ewrewrew
 * #pkyingyu.sso.jwtRSAPrivateKey=dfsafsfsfasfsfsfsfsfsdfsfasfsf #基于RSA算法没有实现完全
 * pkyingyu.sso.encryptType=MD5
 * #过期时间单位 秒：s、分：m、时：h、天：d、毫秒：ms
 * pkyingyu.sso.timeUnit=m
 * pkyingyu.sso.timeValue=10
 */


//@Component
//@ConfigurationProperties(prefix = "pkyingyu.sso")
//@PropertySource("ssoconfig.properties")
public class JWTConfigBean {

    private String encryptType = "MD5"; // MD5|RSA
    private String jwtMd5Sign = "pkyy_jwt_pkyy";
    private String jwtRSAPrivateKey;
    private String timeUnit = "d";
    private int timeValue = 1;

    public String getEncryptType() {
        return encryptType;
    }

    public void setEncryptType(String encryptType) {
        this.encryptType = encryptType;
    }

    public String getJwtMd5Sign() {
        return jwtMd5Sign;
    }

    public void setJwtMd5Sign(String jwtMd5Sign) {
        this.jwtMd5Sign = jwtMd5Sign;
    }

    public String getJwtRSAPrivateKey() {
        return jwtRSAPrivateKey;
    }

    public void setJwtRSAPrivateKey(String jwtRSAPrivateKey) {
        this.jwtRSAPrivateKey = jwtRSAPrivateKey;
    }

    public String getTimeUnit() {
        return timeUnit;
    }

    public void setTimeUnit(String timeUnit) {
        this.timeUnit = timeUnit;
    }

    public int getTimeValue() {
        return timeValue;
    }

    public void setTimeValue(int timeValue) {
        this.timeValue = timeValue;
    }
}
