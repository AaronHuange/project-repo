package com.pkyingyu.spring.sso.jwt.entities;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.pkyingyu.spring.sso.jwt.enums.VerifyResultEnum;

/**
 * jwt验证结果类：包含如下属性
 * VerifyResultEnum verifyResultEnum ：验证结果
 * DecodedJWT decodedJWT ：JWT的各个组成部分
 */
public class VerifyResult {

    public static final VerifyResult Result_INVALIDE_SING = new VerifyResult(VerifyResultEnum.INVALIDE_SING);
    public static final VerifyResult Result_JWT_EXPIRES = new VerifyResult(VerifyResultEnum.JWT_EXPIRES);
    public static final VerifyResult Result_ENCRYPT_ERROR = new VerifyResult(VerifyResultEnum.ENCRYPT_ERROR);
    public static final VerifyResult Result_JWT_ERROR = new VerifyResult(VerifyResultEnum.JWT_ERROR);

    public static VerifyResult success(DecodedJWT decodedJWT) {
        VerifyResult result = new VerifyResult(decodedJWT, VerifyResultEnum.SUCCESS);
        return result;
    }

    private DecodedJWT decodedJWT;
    private VerifyResultEnum verifyResultEnum;

    public VerifyResult(VerifyResultEnum verifyResultEnum) {
        this.verifyResultEnum = verifyResultEnum;
    }

    public VerifyResult(DecodedJWT decodedJWT, VerifyResultEnum verifyResultEnum) {
        this.decodedJWT = decodedJWT;
        this.verifyResultEnum = verifyResultEnum;
    }

    public DecodedJWT getDecodedJWT(DecodedJWT decodedJWT, VerifyResultEnum verifyResultEnum) {
        return decodedJWT;
    }

    public DecodedJWT getDecodedJWT() {
        return decodedJWT;
    }

    public void setDecodedJWT(DecodedJWT decodedJWT) {
        this.decodedJWT = decodedJWT;
    }

    public VerifyResultEnum getVerifyResultEnum() {
        return verifyResultEnum;
    }

    public void setVerifyResultEnum(VerifyResultEnum verifyResultEnum) {
        this.verifyResultEnum = verifyResultEnum;
    }
}
