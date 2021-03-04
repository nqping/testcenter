package com.niu.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.io.Serializable;

/**
 * Created by qingping.niu on 2018/3/8.
 */
public interface BaseMapper<T,I extends Serializable>{
    public void insert(T obj);
    public int deleteByPrimaryKey(I id);
    public T selectByPrimaryKey(I id);
    public int updateByPrimaryKey(T obj);
}
