package com.niu.mapper;

import com.niu.common.QueryModel;
import com.niu.entity.Interface;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/3.
 */
@Mapper
public interface InterfaceMapper extends BaseMapper{

    int getCount(Map<String,Object> params);

    List<Interface> findInterfaceList(Map<String,Object> params);

}
