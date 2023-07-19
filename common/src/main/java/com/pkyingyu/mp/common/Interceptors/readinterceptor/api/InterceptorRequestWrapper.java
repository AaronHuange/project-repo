package com.pkyingyu.mp.common.Interceptors.readinterceptor.api;


import com.pkyingyu.mp.common.Interceptors.readinterceptor.impl.MyHttpServletRequestWrapper;

import javax.servlet.http.HttpServletRequest;

public class InterceptorRequestWrapper extends MyHttpServletRequestWrapper {
    public InterceptorRequestWrapper(HttpServletRequest request) {
        super(request);
    }
}
