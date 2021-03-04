package com.niu.common.exception;

import java.io.Serializable;

/**
 * Created by qingping.niu on 2018/3/1.
 */
public class TCException extends RuntimeException implements Serializable {
    private int errorCode;
    private String errorMessage;

    public TCException(){
        this.errorCode = ErrorCode.UNKNOW_ERROR;
        this.errorMessage = ErrorMessage.UNKNOW_ERROR_MESSAGE;
    }

    public TCException(int errorCode, String errorMessage){
        this.errorCode = errorCode;
        this.errorMessage  = errorMessage;
    }

    public TCException(int errorCode){
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}
