package com.niu.common;

import java.util.List;

/**
 * Created by qingping.niu on 2018/3/20.
 */
public class QueryModel {

    /**
     * 每页显示记录数
     */
    private int pageSize;

    /**
     * 当前页
     */
    private int currentPage;

    /**
     * 总页数
     */
    private int totalPage;

    /**
     * 总记录数(查出来的总条数)
     */
    private int recordTotal;

    /**
     * 当前页启始记录
     */
    private int startRecord;

    /**
     * 前页结尾记录
     */
    private int endRecord;

    /**
     * 排序列名
     */
    private String sortColName;
    /**
     * 排序类型
     */
    private String sortType;
    public Object condition;
    private Object searchContent;

    public Object getSearchContent() {
        return searchContent;
    }

    public void setSearchContent(Object searchContent) {
        this.searchContent = searchContent;
    }



    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public int getRecordTotal() {
        return recordTotal;
    }

    public void setRecordTotal(int recordTotal) {
        this.recordTotal = recordTotal;
        totalPage = (recordTotal + pageSize - 1) / pageSize;
        if (currentPage > totalPage) {
            currentPage = totalPage;
        }
        if (currentPage <= 0) {
            currentPage = 1;
        }
    }

    public String getSortColName() {
        return sortColName;
    }

    public void setSortColName(String sortColName) {
        this.sortColName = sortColName;
    }

    public String getSortType() {
        return sortType;
    }

    public void setSortType(String sortType) {
        this.sortType = sortType;
    }

    public Object getCondition() {
        return condition;
    }

    public void setCondition(Object condition) {
        this.condition = condition;
    }



    /**
     * 返回当前页起始记录
     *
     * @return
     */
    public int getStartRecord() {
        if (currentPage == 0) {
            return 0;
        } else {
            return (currentPage - 1) * pageSize;
        }
    }

}
