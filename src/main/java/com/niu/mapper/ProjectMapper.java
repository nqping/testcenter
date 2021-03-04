package com.niu.mapper;

import com.niu.entity.Project;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/4/13.
 */
@Mapper
public interface ProjectMapper extends BaseMapper{
    int getCount(Map<String, Object> param);

    List<Project> getList(Map<String, Object> param);

    List<Project> getAllprojectName();

    Project isExistsProject(String projectName);
}
