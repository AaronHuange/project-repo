package com.pkyingyu.mp.common.Interceptors;

import com.pkyingyu.mp.common.Interceptors.readinterceptor.api.InterceptorRequestWrapper;
import com.pkyingyu.mp.common.entities.enums.ErrorCode;
import com.pkyingyu.mp.common.utils.UtilHashAuth;
import com.pkyingyu.mp.common.utils.UtilJson;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CommonInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (UtilJson.isJson(request)) {
            InterceptorRequestWrapper requestWrapper = new InterceptorRequestWrapper(request);

            /******************* 处理非法来源请求 start *****************/
            String skipCheck = requestWrapper.getHeader("skipCheck");
            if ("i'm good person,don't check request.ok?".equals(skipCheck)) { // 测试接口时，需要添加该请求头
                return true;
            }
            // H5的接口签名方式很容易被破解出来。咋办？，解决方案1：(H5的请求都通过JS桥走原生的HTTP请求）解决方案2：(相关请求头部分由原生提供)
            String time = requestWrapper.getHeader("time");
            String sign = requestWrapper.getHeader("sign");
            if(StringUtils.isEmpty(time) || StringUtils.isEmpty(sign)) {
                // 非法请求
                return UtilJson.returnJson(response, ErrorCode.REJECT_REQUEST);
            }
            // 若客户端把本地时间改很晚,抓一个签名来频繁用。咋办？，解决方案：(需要校验服务器时间是否与传过来的时间相差太大)
            long clientTime = Long.parseLong(time);
            long serverTime = System.currentTimeMillis();
            System.out.println("服务端时间：" + serverTime + ",客户端时间：" + clientTime);
            if (Math.abs(serverTime - clientTime) > (20 * 1000)) { // 请求的时间戳相差超过 20 秒，怀疑非法
                // 检测本地时间是否正确？
                return UtilJson.returnJson(response, ErrorCode.TIME_ERROR);
            }
            // 校验合法性
            if(!sign.equals(UtilHashAuth.getMD5(";',./;]" + time))) {
                // 非法请求
                return UtilJson.returnJson(response, ErrorCode.REJECT_REQUEST);
            }
            /******************* 处理非法来源请求 end *****************/
            return true;
        }
        return UtilJson.returnJson(response, ErrorCode.NOT_JSON);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }

}

