package com.niu.dao;

import com.niu.dao.impl.BaseDaoImpl;
import com.niu.entity.Project;
import com.niu.mapper.BaseMapper;
import com.niu.mapper.ProjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/13.
 */
@Repository
public class ProjectDao extends BaseDaoImpl<Project,Integer> implements BaseDao<Project,Integer>{

    @Autowired
    private ProjectMapper projectMapper;
    @Override
    public BaseMapper<Project, Integer> getMapper() {
        return projectMapper;
    }

    public int getCount(Map<String, Object> param) {
        return projectMapper.getCount(param);
    }

    public List<Project> getList(Map<String, Object> param) {
        return projectMapper.getList(param);
    }

    public List<Project> getAllprojectName() {
        return projectMapper.getAllprojectName();
    }

    public boolean isExistsProject(String projectName) {
        Project project = projectMapper.isExistsProject(projectName);
        return project == null ? true:false;
    }
}
