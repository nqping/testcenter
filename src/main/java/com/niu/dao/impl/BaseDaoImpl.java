package com.niu.dao.impl;

import com.niu.dao.BaseDao;
import com.niu.mapper.BaseMapper;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;

/**
 * Created by qingping.niu on 2018/3/5.
 */
public abstract class BaseDaoImpl<T,I extends Serializable> implements BaseDao<T,I>{
    private Class<T> entityClass;
    private BaseMapper<T,I> mapper;
    public abstract BaseMapper<T,I> getMapper();
    @PostConstruct
    public void init() {
        entityClass =
                (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        this.mapper = getMapper();
    }

    public void save(T obj){
        mapper.insert(obj);
    }

    public int delete(I id){
       int row = mapper.deleteByPrimaryKey(id);
       return row;
    }

    public int update(T obj){
        int row = mapper.updateByPrimaryKey(obj);
        return row;
    }

//    protected  BaseDaoImpl(Class<T> entityClass){
//        this.entityClass = entityClass;
//    }

}
