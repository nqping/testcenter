package com.niu.services;

import com.niu.common.QueryModel;
import com.niu.dao.ProjectDao;
import com.niu.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/13.
 */
@Service
@Transactional(readOnly = true)
public class ProjectService {
    @Autowired
    private ProjectDao projectDao;

    public List<Project> getList(QueryModel queryModel) {
        //组装参数
        Project project = (Project) queryModel.getCondition();
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("startRecord",queryModel.getStartRecord());
        param.put("pageSize",queryModel.getPageSize());
        param.put("projectName",project.getProjectName());
        List<Project> list = projectDao.getList(param);
        int recordTotal = projectDao.getCount(param);
        queryModel.setRecordTotal(recordTotal); //总记录数
        return list;
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void deleteById(int projectId) {
        projectDao.delete(projectId);
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void addProject(Project project) {
        projectDao.save(project);
    }

    @Transactional(readOnly = false,propagation = Propagation.REQUIRED)
    public void updateProject(Project project) {
        projectDao.update(project);
    }

    public List<Project> getAllprojectName() {
        return projectDao.getAllprojectName();
    }

    public boolean isExistsProject(String projectName) {
        return projectDao.isExistsProject(projectName);
    }
}
