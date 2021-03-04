package com.niu.common.exception;

/**
 * Created by qingping.niu on 2018/3/1.
 */
public interface ErrorCode {
    public static final int UNKNOW_ERROR = 100; //未知异常
    public static final int PARAMETER_ERROR = 200; //参数错误
    public static final int NOT_LOGIN_ERROR = 3001; //未登录
    public static final int NOT_PERMISSIONS_ERROR = 4001;	 //无权限
    public static final int TIME_OUT = 5001; //超时

    //user
    public static final int USER = 2000;
    public static final int USER_LOGIN_ERROR = USER +1;

    //project
    public static final int PROJECT = 3000;
    public static final int PROJECT_EXISTS_ERROR = PROJECT +1;

}
