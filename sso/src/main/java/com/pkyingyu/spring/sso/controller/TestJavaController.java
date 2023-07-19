package com.pkyingyu.spring.sso.controller;

import com.pkyingyu.spring.sso.jwt.entities.VerifyResult;
import com.pkyingyu.spring.sso.jwt.enums.VerifyResultEnum;
import com.pkyingyu.spring.sso.jwt.manager.JWTManager;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Deprecated
@RestController
@EnableAutoConfiguration
public class TestJavaController {

    @GetMapping("bbb")
    public String aaa() {
        Map<String, String> map = new HashMap<>();
        map.put("userId", "1111");
        String jwt = JWTManager.getJWT(map);

        VerifyResult result = JWTManager.verifyJWT(jwt);
        boolean success = result.getVerifyResultEnum() == VerifyResultEnum.SUCCESS;

        return "get properties  :" +
                //1、使用@Value注解读取
                " success=" + success +
                " , jwt=" + jwt +
                " , jwt=" + result.getDecodedJWT();
    }

}
