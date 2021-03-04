package com.niu.dao;

import com.niu.common.QueryModel;
import com.niu.dao.impl.BaseDaoImpl;
import com.niu.entity.Admin;
import com.niu.mapper.BaseMapper;
import com.niu.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/3/5.
 */
@Repository
public class AdminDao extends BaseDaoImpl<Admin,Integer> implements BaseDao<Admin,Integer>{

    @Autowired
    public AdminMapper adminMapper;

    @Override
    public BaseMapper<Admin, Integer> getMapper() {
        return adminMapper;
    }

    public Admin findUserByEmailAndPassword(String email, String password) {
       Admin admin = adminMapper.findUserByEmailAndPassword(email,password);
        return admin;
    }

    public Admin findByEmail(String email){
        return  adminMapper.findByEmail(email);
    }

    public List<Admin> findAdminList(QueryModel queryModel){
        return adminMapper.findAdminList(queryModel);
    }

    public int getCount(Map<String, Object> params){
        return adminMapper.getCount(params);

    }

    public int deleteBatch(String [] id) {
        return adminMapper.deleteBatch(id);
    }

    public List<Admin> getUserAll() {
        return adminMapper.getUserAll();
    }
}
