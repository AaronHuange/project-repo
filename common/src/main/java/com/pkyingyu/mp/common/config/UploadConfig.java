package com.pkyingyu.mp.common.config;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.MultipartConfigElement;

@Configuration
public class UploadConfig implements WebMvcConfigurer {

    /****SpringBoot项目推荐使用jar包的方式来运行项目，而实际应用中我们也发现jar包运行项目更加方便。
     * 但是当打完jar包后，这个jar的大小就固定好了，上传的文件肯定传不到jar包里面了。
     * SpringBoot提供了一种方式，将文件上传到服务器物理路径下，然后做个映射关系，让图片可以正常被访问
     */
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/static/**").addResourceLocations("file:" + "/usr/share/nginx/html/pkyingyu-upload/");
//    }

//    public static final String uploadPath = "/usr/share/nginx/html/pkyingyu-upload/";
    public static final String uploadPath = "/Volumes/SD_1TB/project/spring/springclound-gradle/backstage/filesave";
    public static final String uploadAppPath = "/Volumes/SD_1TB/project/spring/springclound-gradle/backstage/appfilesave";

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        // 单个文件大小 bytes
        factory.setMaxFileSize(1024 * 1024 * 10); //10MB
        // 上传的总文件大小 bytes
        factory.setMaxRequestSize(1024 * 1024 * 10 * 5); //50MB
        return factory.createMultipartConfig();
    }
}
