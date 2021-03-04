package com.niu.web.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.niu.common.QueryModel;
import com.niu.common.exception.TCException;
import com.niu.common.utils.JsonMapper;
import com.niu.entity.Interface;
import com.niu.services.InterfaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/3.
 */
@Controller
@RequestMapping("/interface")
public class InterfaceController extends ExceptionHandlerAdvice{
    @Autowired
    private InterfaceService interfaceService;

    @RequestMapping(value="/list",method = RequestMethod.POST)
    @ResponseBody
    public Object list(@RequestBody String jsonParams){
        if (jsonParams == null) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        JsonNode node;
        int currentPage = 0;//当前页
        int pageSize = 0; //每页显示行数
        QueryModel queryModel = new QueryModel();
        Interface interObj = new Interface();
        try{
            node = JsonMapper.nonDefaultMapper().getMapper()
                    .readTree(jsonParams);
            currentPage = node.get("page").asInt(); //当前页
            pageSize = node.get("rows").asInt(); //每页显示行数
            if(!node.get("domainName").isNull()){
                interObj.setDomainName(node.get("domainName").asText());
            }
            if(!node.get("projectName").isNull()){
                interObj.setProjectId(node.get("projectName").asInt());
            }
        }catch (IOException e){
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        queryModel.setCurrentPage(currentPage);
        queryModel.setPageSize(pageSize);
        queryModel.setCondition(interObj);
        List interfaceList = interfaceService.findInterfaceList(queryModel);
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("rows",interfaceList); //数据集
        data.put("page",queryModel.getCurrentPage());//当前页
        data.put("total",queryModel.getTotalPage());//总页数
        data.put("records",queryModel.getRecordTotal());//总记录数
        result = data;
        return model();
    }

    @RequestMapping(value="/add",method = RequestMethod.POST)
    @ResponseBody
    public Object addInterface(Interface interfaceObj){
        interfaceObj.setUpdateTime(new Date());
        interfaceService.addInterface(interfaceObj);
        return model();
    }

    @RequestMapping(value="/modify",method = RequestMethod.POST)
    @ResponseBody
    public Object modify(Interface interObj){
        interObj.setUpdateTime(new Date());
        interfaceService.updateInterface(interObj);
        return model();
    }

    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Object delete(int interfaceId){
        interfaceService.deleteInterface(interfaceId);
        return model();
    }
}
