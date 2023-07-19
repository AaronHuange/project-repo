package com.pkyingyu.mp.common.entities.http.request;

public class BaseRequest {
    private String userId;
    private String requestNo;//时间加deviceId
    private String clientType;
    //private String token; //放头里面,否则拦截器要解析一遍json字符串

//    public String getToken() {
//        return token;
//    }
//
//    public void setToken(String token) {
//        this.token = token;
//    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRequestNo() {
        return requestNo;
    }

    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getClientType() {
        return clientType;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType;
    }
}
