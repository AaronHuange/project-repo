package com.pkyingyu.mp.common.entities.enums;

public enum ErrorCode {
    REQUEST_ERROR("0009", "请求异常"),
    SQL_ERROR("1000", "数据库异常"),
    UNZIP_ERROR("1009", "解压异常"),
    PASSWORD_EMPTY("1003", "密码不能为空"),
    PARAMS_EMPTY("1111", "参数不能为空"),
    USER_PASSWORD_ERROR("1113", "账号或密码错误"),
    USER_EMPTY("1113", "用户不存在"),
    USER_EXIST("1119", "用户已存在"),
    PARAMS_MISS("1115", "请求参数缺失"),
    PARAMS_ERROR("1115", "请求参数格式不正确"),
    NEED_LOGIN("6789", "请先登录"),
    NOT_JSON("1117", "请求数据应为json数据"),
    PHONE_HAVE_USE("1002", "手机号已被注册"),
    PASSWORD_NO_SAME("1006", "两次密码不一致"),
    PASSWORD_ERROR("1007", "密码不正确"),
    VERIFY_ERROR("2000", "验证码验证失败"),
    VERIFY_EXPIET("2002", "验证码过期"),
    PLEASE_GAIN_VERIFY_CODE("2100", "请先获取验证码"),
    VERIFY_NOT_THIS_PHONE("2001", "手机号和短信验证码不匹配"),
    LOGIN_TIMEOUT("2002", "登录超时"),
    JWT_ERROR("9970", "JWT_ERROR"),
    JWT_EXPIRES("9980", "JWT_EXPIRES"),
    ENCRYPT_ERROR("9990", "ENCRYPT_ERROR"),
    INVALIDE_SING("9900", "INVALIDE_SING"),
    PHONE_ERROR("3000", "手机号格式错误"),
    BOOK_EXIST("3001", "图书已存在"),
    CHAPTER_EXIST("3006", "章节已存在"),
    CHAPTER_NOT_EXIST("3010", "章节不存在"),
    APP_CONFIG_MISS("3009", "APP配置丢失"),
    ENGCORE_EXIST("3100", "和已发布英语角冲突"),
    LAT_LONG_MISS("3101", "经纬度信息丢失"),
    BOOK_NO_EXIST("3002", "图书不存在"),
    OFFLINE_EXIST("8001", "离线包已存在"),
    OFFLINE_NO_EXIST("8002", "离线包不存在"),
    APP_EXIST("8003", "APP已存在"),
    APP_NO_EXIST("8005", "APP不存在"),
    TYPE_ERROR("8006", "类型不支持"),
    SAVE_FILE_ERROR("1118", "保存文件出错"),
    SAVE_FILE_EMPTY("8007", "待保存的文件为空"),
    SAVE_FILE_REQUEST_ERROR("8010", "保存文件类型请求错误"),
    VERSION_NEED_NUMBER("8011", "版本号需要数值型"),
    SAVE_FILE_ONLY_ONE("8009", "只能上传一个文件"),

    HAD_FOLLOW("8012", "已关注该用户"),
    QINIU_ERROR("8014", "七牛服务异常"),

    PRAISE_ONLY_ONCE("8015", "不能重复点赞"),
    CARD_ONLY_ONCE("8016", "不能重复打卡"),
    EXIST_COLLECT("8017", "已经收藏了"),
    REJECT_REQUEST("8018", "非法请求,IP来源已记录在案"),
    TIME_ERROR("8019", "本地时间不正确"),
    NO_EXIST_COLLECT("8016", "还没有收藏"),
    NO_FOLLOW("8013", "未关注该用户"),
    NO_SELECT("9000", "未选择图书");

    private String code;
    private String msg;

    ErrorCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
