package com.niu.services;

import com.niu.common.QueryModel;
import com.niu.dao.AdminDao;
import com.niu.entity.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/2/12.
 */
@Service
@Transactional(readOnly = true)
public class AdminService {
    @Autowired
    private AdminDao adminDao;

    public Admin findUserByEmailAndPassword(String email, String password){

       return adminDao.findUserByEmailAndPassword(email,password);
    }

    public Admin findByEmail(String email){
        return adminDao.findByEmail(email);
    }

    public List findAdminList(QueryModel queryModel) {
        //组装参数
        List<Admin> list = adminDao.findAdminList(queryModel);
        Map<String ,Object> param = new HashMap<String,Object>();
        int recordTotal = adminDao.getCount(param);
        queryModel.setRecordTotal(recordTotal); //总记录数
        return list;
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public boolean deleteAdminById(String [] id) {
        int row = adminDao.deleteBatch(id);
        return row >0 ? true:false;
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public boolean updateAdmin(Admin admin) {
        int row = adminDao.update(admin);
        return row >0 ? true:false;
    }

    public List<Admin> getUserAll() {
        List<Admin> list = adminDao.getUserAll();
        return list;
    }
}
