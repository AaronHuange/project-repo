package com.pkyingyu.mp.common.entities.http.response;

import com.pkyingyu.mp.common.entities.enums.ErrorCode;
import com.pkyingyu.mp.common.utils.UtilDateTime;

import java.util.Date;
import java.util.UUID;

public class BaseResponse {

    public BaseResponse faile(ErrorCode errorCode) {
        this.returnCode = errorCode.getCode();
        this.returnMessage = errorCode.getMsg();
        this.responseTime = UtilDateTime.date2String(new Date());
        this.responsetNo = UUID.randomUUID().toString().replaceAll("-", "");
        return this;
    }

    public BaseResponse success() {
        this.setResponseTime(UtilDateTime.date2String(new Date()));
        this.setResponsetNo(UUID.randomUUID().toString().replaceAll("-", ""));
        return this;
    }


    private String returnCode = "0000";

    private String returnMessage = "success";

    private String responseTime;

    private String responsetNo;

    public String getReturnCode() {
        return returnCode;
    }

    public void setReturnCode(String returnCode) {
        this.returnCode = returnCode;
    }

    public String getReturnMessage() {
        return returnMessage;
    }

    public void setReturnMessage(String returnMessage) {
        this.returnMessage = returnMessage;
    }

    public String getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(String responseTime) {
        this.responseTime = responseTime;
    }

    public String getResponsetNo() {
        return responsetNo;
    }

    public void setResponsetNo(String responsetNo) {
        this.responsetNo = responsetNo;
    }

}
