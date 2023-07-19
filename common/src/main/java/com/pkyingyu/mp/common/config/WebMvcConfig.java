package com.pkyingyu.mp.common.config;

import com.pkyingyu.mp.common.Interceptors.CommonInterceptor;
import com.pkyingyu.mp.common.Interceptors.NeedLoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        
        registry.addInterceptor(new CommonInterceptor()) // 拦截所有请求，判断是会否是不合法来源
                .addPathPatterns("/pkyingyu/**");

        registry.addInterceptor(new NeedLoginInterceptor())
                .addPathPatterns("/pkyingyu/pri/**")  //拦截所有 /pkyingyu/pri 的请求
                .excludePathPatterns("/pkyingyu/pub/**"); //放行上传文件类型请求
        super.addInterceptors(registry);
    }

}
