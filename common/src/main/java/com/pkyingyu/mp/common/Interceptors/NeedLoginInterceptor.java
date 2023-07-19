package com.pkyingyu.mp.common.Interceptors;

import com.auth0.jwt.interfaces.Claim;
import com.pkyingyu.mp.common.Interceptors.readinterceptor.api.InterceptorRequestWrapper;
import com.pkyingyu.mp.common.config.YmlConfig;
import com.pkyingyu.mp.common.utils.UtilHashAuth;
import com.pkyingyu.mp.common.utils.UtilJson;
import com.pkyingyu.mp.common.entities.enums.ErrorCode;
import com.pkyingyu.mp.common.entities.http.request.BaseRequest;
import com.pkyingyu.mp.common.utils.UtilSpringBean;
import com.pkyingyu.spring.sso.jwt.entities.VerifyResult;
import com.pkyingyu.spring.sso.jwt.manager.JWTManager;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;

//@Configuration
public class NeedLoginInterceptor implements HandlerInterceptor {

    //@Autowired
    //private YmlConfig ymlConfig; //若类A中包含成员属性B, B是通过@Autowired自动注入，而类A的实例是通过new的方式产生，则自动注入会失效的。
    private YmlConfig ymlConfig;

    {
        ymlConfig = (YmlConfig) UtilSpringBean.getBean(YmlConfig.class);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (UtilJson.isJson(request)) {
            InterceptorRequestWrapper requestWrapper = new InterceptorRequestWrapper(request);

            /******************* 校验需要登录token请求 start *****************/
            String jwt = requestWrapper.getHeader("token");
            //String jwt = requestWrapper.getParameter("token");
            if (StringUtils.isEmpty(jwt)) {
                return UtilJson.returnJson(response, ErrorCode.NEED_LOGIN);
            }
            return jwtInterceptor(response, jwt);
        }
        return UtilJson.returnJson(response, ErrorCode.NOT_JSON);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }


    /*** 需要登录的接口,JWT相关拦截判断
     * @param response
     * @param jwt***/
    private boolean jwtInterceptor(HttpServletResponse response, String jwt) {
        System.out.println("jwt:" + jwt);
        VerifyResult verifyResult = JWTManager.verifyJWT(jwt);
        switch (verifyResult.getVerifyResultEnum()) {
            case JWT_ERROR:
                return UtilJson.returnJson(response, ErrorCode.JWT_ERROR);
            case JWT_EXPIRES:
                return UtilJson.returnJson(response, ErrorCode.JWT_EXPIRES);
            case ENCRYPT_ERROR:
                return UtilJson.returnJson(response, ErrorCode.ENCRYPT_ERROR);
            case INVALIDE_SING:
                return UtilJson.returnJson(response, ErrorCode.INVALIDE_SING);
            case SUCCESS:
                /***  判断是否需要续期 ***/
                long expiresAT = verifyResult.getDecodedJWT().getExpiresAt().getTime();
                if (expiresAT - new Date().getTime() < ymlConfig.getTimeoutRefresh() * 60 * 1000) { //快要过去了,TODO 续期提前时间应该是配置文件配置的
                    //在响应头返回新的token
                    Map<String, String> newMap = new HashMap<>();
                    verifyResult.getDecodedJWT().getClaims().forEach(new BiConsumer<String, Claim>() {
                        @Override
                        public void accept(String s, Claim claim) {
                            newMap.put(s, claim.asString());
                        }
                    });
                    response.addHeader("token", JWTManager.getJWT(newMap));
                }
                return true;
        }
        return false;
    }

    /*** 需要登录的接口,用户信息相关拦截判断
     * @param response
     * @param jsonBody
     ***/
    private boolean userInfoInterceptor(HttpServletResponse response, String jsonBody) {
        BaseRequest baseRequest = UtilJson.toObject(jsonBody, BaseRequest.class);
        if (baseRequest != null) {
            if (StringUtils.isEmpty(baseRequest.getUserId())) {
                return UtilJson.returnJson(response, ErrorCode.NEED_LOGIN);
            } else {
                return true;
            }
        } else {
            return UtilJson.returnJson(response, ErrorCode.PARAMS_MISS);
        }
    }

}
