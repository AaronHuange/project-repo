package com.pkyingyu.spring.sso;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/*** 这个使用java文件，使用kotlin会找不到最外层的main方法(springboot找不到，不是kt找不到) ***/
@Deprecated
//@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.pkyingyu.mp.sso.**"})
public class SsoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsoApplication.class, args);
    }

}
