package com.niu.services;

import com.niu.common.QueryModel;
import com.niu.dao.InterfaceDao;
import com.niu.entity.Interface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/3.
 */
@Service
@Transactional(readOnly = true)
public class InterfaceService {
    @Autowired
    private InterfaceDao interfaceDao;

    public List findInterfaceList(QueryModel queryModel) {
        Interface interObj = (Interface)queryModel.getCondition();
        //组装参数
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("startRecord",queryModel.getStartRecord());
        param.put("pageSize",queryModel.getPageSize());
        param.put("domainName",interObj.getDomainName());
        param.put("projectId",interObj.getProjectId());
        List<Interface> list  = interfaceDao.findInterfaceList(param);
        int recordTotal = interfaceDao.getCount(param);
        queryModel.setRecordTotal(recordTotal); //总记录数
        return list;
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void addInterface(Interface interfaceObj) {
        interfaceDao.save(interfaceObj);
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void updateInterface(Interface interObj) {
        interfaceDao.update(interObj);
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void deleteInterface(int interfaceId) {
        interfaceDao.delete(interfaceId);
    }
}

