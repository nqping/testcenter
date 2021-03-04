package com.niu.common.exception;

/**
 * Created by qingping.niu on 2018/3/1.
 */
public interface ErrorMessage {
    public static final String UNKNOW_ERROR_MESSAGE = "系统未知错误";
    public static final String PARAMETER_ERROR_MESSAGE = "请求参数错误";

    public static final String NOT_LOGIN_ERROR_MESSAGE = "您还未登录,请先登录";
    public static final String NOT_PERMISSIONS_ERROR_MESSAGE = "未授权不能访问";
    public static final String TIME_OUT_MESSAGE = "会话过期";

    public static final String USER_LOGIN_ERROR_MESSAGE = "用户名或密码错误";

    public static final String PROJECT_EXISTS_ERROR_MESSAGE = "项目已存在";
}
