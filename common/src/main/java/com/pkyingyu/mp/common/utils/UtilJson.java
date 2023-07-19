package com.pkyingyu.mp.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pkyingyu.mp.common.entities.enums.ErrorCode;
import com.pkyingyu.mp.common.entities.http.response.BaseResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class UtilJson {

    /**
     * 将jason数据转为对象
     *
     * @param obString
     * @param type
     * @param <T>
     * @return
     */
    public static <T> T toObject(String obString, Class<T> type) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            //忽略不知道的字段，还可以通过在响应对象类上架注解的方式
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return mapper.readValue(obString.replaceAll("\n|\t|\r", ""), type);
        } catch (IOException e) {
            //e.printStackTrace();
            return null;
        }
    }

    /**
     * 将对象转为json数据
     *
     * @param t
     * @param <T>
     * @return
     */
    public static <T> String toJson(T t) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(t).replaceAll("\n|\t|\r", "");
        } catch (JsonProcessingException e) {
            //e.printStackTrace();
            return "";
        }
    }


    /**
     * 判断本次请求的数据类型是否为json
     *
     * @param request request
     * @return boolean
     */
    public static boolean isJson(HttpServletRequest request) {
        return true;
//        下面的判断在 {"data":{}} 的形式是手机上判断为false，postman判断为true
//        if (request.getContentType() != null) {
//            return request.getContentType().equals(MediaType.APPLICATION_JSON_VALUE) ||
//                    request.getContentType().equals(MediaType.APPLICATION_JSON_UTF8_VALUE);
//        }

//        return false;
    }


    /**
     * 构造响应体响应请求，并返回false是拦截器拦截请求
     *
     * @param response
     * @param errorCode
     * @return
     */
    public static boolean returnJson(HttpServletResponse response, ErrorCode errorCode) {
        PrintWriter writer = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        try {
            writer = response.getWriter();
            BaseResponse baseResponse = new BaseResponse();
            baseResponse.faile(errorCode);
            writer.print(UtilJson.toJson(baseResponse));
        } catch (IOException e) {
//            LoggerUtil.logError(ECInterceptor.class, "拦截器输出流异常" + e);
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
        return false;
    }

}
