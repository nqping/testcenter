package com.niu.mapper;

import com.niu.common.QueryModel;
import com.niu.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/2/12.
 */
@Mapper
public interface AdminMapper extends BaseMapper{
    int save(Admin adminModel);
    Admin findUserByEmailAndPassword(@Param("email") String email, @Param("password") String password);
    Admin findByEmail(String email);
    int getCount(Map<String, Object> params);

    List<Admin> findAdminList(@Param("queryModel") QueryModel queryModel);

    int deleteBatch(String [] id);

    List<Admin> getUserAll();
}
