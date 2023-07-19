package com.pkyingyu.spring.sso.jwt.enums;

public enum VerifyResultEnum {
    SUCCESS,
    INVALIDE_SING, //无效签名
    JWT_EXPIRES, //token过期
    ENCRYPT_ERROR, //token算法不一致
    JWT_ERROR //JWT无效
}
