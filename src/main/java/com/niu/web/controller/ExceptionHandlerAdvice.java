package com.niu.web.controller;

import com.niu.common.exception.ErrorCode;
import com.niu.common.exception.ErrorMessage;
import com.niu.common.exception.TCException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/3/1.
 */
@ControllerAdvice
public class ExceptionHandlerAdvice implements ErrorCode,ErrorMessage {
    /**
     * logger
     */
    private static final Logger logger = Logger.getLogger(ExceptionHandlerAdvice.class);

    /**
     * 请求
     */
    @Autowired
    protected HttpServletRequest request;
    /**
     * 响应
     */
    @Autowired
    protected HttpServletResponse response;

    protected int errorCode = 0;
    protected String errorMessage = null;
    protected Object result = null;
    protected String viewName = null;

    @ResponseBody
    @ExceptionHandler(value = {TCException.class})
    protected Object handleTCException(TCException ex, WebRequest request){
        loggerException(ex);
        this.errorCode = ex.getErrorCode();
        this.errorMessage = ex.getErrorMessage();
        this.result = null;
        return model();
    }

    @ResponseBody
    @ExceptionHandler(value = { HttpMessageNotReadableException.class})
    protected Object handleConflict(Exception ex,WebRequest request){
        loggerException(ex);
        this.errorCode = PARAMETER_ERROR;
        this.errorMessage = PARAMETER_ERROR_MESSAGE;
        this.result = null;
        return model();
    }

    protected Object model() {
        Map<String, Object> valMap = new LinkedHashMap<String, Object>();
        valMap.put("errorCode", this.errorCode);
        valMap.put("errorMessage", this.errorMessage);
        valMap.put("result", this.result);
        this.errorCode = 0;
        this.errorMessage = null;
        this.result = null;
        return valMap;
    }

    @ResponseBody
    @ExceptionHandler(value = {RuntimeException.class})
    protected Object handleRuntimeException(RuntimeException ex,WebRequest request){
        //loggerException(ex);
        this.errorCode = UNKNOW_ERROR;
        this.errorMessage = UNKNOW_ERROR_MESSAGE;
        logger.error(ex.getMessage());
        return model();
    }

    protected Object modelView(String viewName){
        Map<String, Object> valMap = new LinkedHashMap<String, Object>();
        valMap.put("errorCode", this.errorCode);
        valMap.put("errorMessage", this.errorMessage);
        valMap.put("result", this.result);
        this.errorCode = 0;
        this.errorMessage = null;
        this.result = null;
        this.viewName = viewName;
        ModelAndView view = new ModelAndView(this.viewName, valMap);
        return view;
    }

    public void loggerException(Exception e) {
        if (logger.isDebugEnabled()) {
            if (e != null && e instanceof TCException) {
                logger.debug(((TCException) e).getErrorCode(), e);
            } else {
                logger.debug(-1, e);
            }
        }
        if (logger.isInfoEnabled()) {
            if (e != null && e instanceof TCException) {
                logger.info(((TCException) e).getErrorCode(), e);
            } else {
                logger.info(-1, e);
            }
        } else {
            if (e != null && e instanceof TCException) {
                logger.error(((TCException) e).getErrorCode(), e);
            } else {
                logger.error(-1, e);
            }
        }
    }
}
