package com.niu.common.utils;

/**
 * Created by qingping.niu on 2018/3/13.
 */
public class Cache {
    private String key; // 缓存ID
    private Object value; // 缓存数据
    private long timeOut; // 设置缓存多长时间后过期

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public long getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(long timeOut) {
        this.timeOut = timeOut;
    }
}
