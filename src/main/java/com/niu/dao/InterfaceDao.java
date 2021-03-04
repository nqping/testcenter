package com.niu.dao;

import com.niu.common.QueryModel;
import com.niu.dao.impl.BaseDaoImpl;
import com.niu.entity.Interface;
import com.niu.mapper.BaseMapper;
import com.niu.mapper.InterfaceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/3.
 */
@Repository
public class InterfaceDao extends BaseDaoImpl<Interface,Integer> implements BaseDao<Interface,Integer> {

    @Autowired
    private InterfaceMapper interfaceMapper;

    @Override
    public BaseMapper<Interface, Integer> getMapper() {
        return interfaceMapper;
    }

    public List<Interface> findInterfaceList(Map<String,Object> params) {
       return interfaceMapper.findInterfaceList(params);
    }

    public int getCount(Map<String,Object> params) {
        return interfaceMapper.getCount(params);
    }

}
