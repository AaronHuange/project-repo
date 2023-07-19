package com.pkyingyu.mp.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "pkyingyu.sso")
@PropertySource("ssoconfig.properties")
public class YmlConfig {

    private String laveRefreshTime;

    public int getTimeoutRefresh() {
        int result = 0;
        try {
            result = Integer.parseInt(laveRefreshTime);
        } catch (Exception e) {

        }
        return result;
    }

    public void setLaveRefreshTime(String laveRefreshTime) {
        this.laveRefreshTime = laveRefreshTime;
    }
}
