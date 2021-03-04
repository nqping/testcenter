package com.niu.web.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.niu.common.QueryModel;
import com.niu.common.exception.TCException;
import com.niu.common.utils.JsonMapper;
import com.niu.entity.Interface;
import com.niu.entity.Project;
import com.niu.services.ProjectService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * Created by qingping.niu on 2018/4/13.
 */
@Controller
@RequestMapping("/project")
public class ProjectController extends ExceptionHandlerAdvice {
    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectService projectService;

    @RequestMapping(value="/list",method = RequestMethod.POST)
    @ResponseBody
    public Object getList(@RequestBody String jsonParams){
        if (jsonParams == null) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        JsonNode node;
        Project project = new Project();
        QueryModel queryModel = new QueryModel();
        try{
            node = JsonMapper.nonDefaultMapper().getMapper()
                    .readTree(jsonParams);
            if(!node.get("page").isNull()){
                queryModel.setCurrentPage(node.get("page").asInt());//当前页
            }
            if(!node.get("rows").isNull()){
                queryModel.setPageSize(node.get("rows").asInt());//每页显示行数
            }
            if(!node.get("projectName").isNull()){
                project.setProjectName(node.get("projectName").asText());
                queryModel.setCondition(project);
            }

        }catch (IOException e){
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }

        List<Project> projectList = projectService.getList(queryModel);
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("rows",projectList); //数据集
        data.put("page",queryModel.getCurrentPage());//当前页
        data.put("total",queryModel.getTotalPage());//总页数
        data.put("records",queryModel.getRecordTotal());//总记录数
        result = data;
        return model();
    }

    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    public Object delete(int projectId){
        projectService.deleteById(projectId);
        return model();
    }

    @RequestMapping(value = "/add",method = RequestMethod.POST)
    @ResponseBody
    public Object addProject(Project project){
        //验证是否已存在
       boolean flag = projectService.isExistsProject(project.getProjectName());
       if(flag){//为true时表示不存在
           project.setUpdateTime(new Date());
           projectService.addProject(project);
       }else{
           throw new TCException(PROJECT_EXISTS_ERROR, PROJECT_EXISTS_ERROR_MESSAGE);
       }
        return model();
    }

    @RequestMapping(value = "/modify",method = RequestMethod.POST)
    @ResponseBody
    public Object modifyProject(Project project){
        projectService.updateProject(project);
        return model();
    }

    @RequestMapping(value="/allname",method = RequestMethod.POST)
    @ResponseBody
    public Object getAllprojectName(){
        List<Project> list = projectService.getAllprojectName();
        result = list;
        return model();
    }
}
