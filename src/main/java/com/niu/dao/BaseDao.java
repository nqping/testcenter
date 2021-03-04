package com.niu.dao;

import java.io.Serializable;

/**
 * Created by qingping.niu on 2018/3/5.
 */
public interface BaseDao<T,I extends Serializable> {
    public void save(T obj);

    public int delete(I id);

    public int update(T obj);

}
