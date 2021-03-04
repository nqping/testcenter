/**
 * Created by qingping.niu on 2018/5/3.
 */
//定义参数常量
var oTable=null;
var grid_selector = "#interfaceDetailTable";
var pager_selector = "#interfaceDetailPaper";
$(function () {
    var projectName = getUrlParam("pname");
    console.log(projectName);

    drawTable(projectName);
    $('#projectNameTemp').text(projectName);
});

function drawTable(projectName) {
    var parent_column = $(grid_selector).closest('[class*="col-"]');
    //resize to fit page size
    $(window).on('resize.jqGrid', function () {
        $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
    });
    //resize on sidebar collapse/expand
    $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
        if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
            //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
            setTimeout(function() {
                $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
            }, 20);
        }
    });
    oTable = $(grid_selector).jqGrid({
        url: httpPath+"/interface/list",
        mtype: "post",
        datatype : "json",
        prmNames:{id:"interfaceId",search:"search"},//更改参数名称
        postData: {"domainName":"","projectName":projectName},
        ajaxGridOptions : {contentType: "application/json; charset=utf-8"},
        height: "50%",
        colNames: ["编号","域名","接口名","接口地址","请求方式","数据传输方式","用例数","更新时间","管理操作"],
        colModel:[
            {name:"interfaceId",index:'interfaceId',width:50,fixed:true,sortable:true,align:"left"},
            {name:"domainName",index:"domainName",width:250,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceName",index:"interfaceName",width:110,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceAddress",index:"interfaceAddress",width:250,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"requestType",index:"requestType",width:70,fixed:true,align:"left"},
            {name:"dataType",index:"dataType",width:100,fixed:true,align:"left"},
            {name:"useCaseCount",index:"useCaseCount",width:50,fixed:true,align:"center"},
            {name:"updateTime",index:"updateTime",width:150,fixed:true,align:"center",
                formatter:function(cellvalue, options, cell){
                    var dt = new Date(cellvalue);
                    return dt.format("yyyy-MM:dd hh:mm:ss");
                }},
            {name:"operation",id:"operation",width:200,align:"left"}],
        viewrecords: true,
        rowNum:10,
        rowList:[10,20,30],
        rownumbers: false, //不显示行号
        pager : pager_selector,
        altRows: true,
        page:0,
        multiselect: false, //不显示复选框
        multiboxonly: false,
        toolbar:[true,"top"],
        serializeGridData: function(postData){
            //console.log(JSON.stringify(postData))
            return JSON.stringify(postData);
        },
        jsonReader:{
            root:"result.rows",// json中代表实际模型数据的入口
            records:"result.records",//查询出的记录数
            total:"result.total", //总页数
            page:"result.page",//当前页
            id:"interfaceId" //rowId与后台id对应
        },
        loadComplete: function(){
            var table = this;
            setTimeout(function(){
                updatePagerIcons(table);
                enableTooltips(table);
            },0);
        },
        gridComplete: function () {
            var ids = $(grid_selector).jqGrid("getDataIDs");
            for ( var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                editAnddelBtn = '<div id="editDiv_'+cl+'" class="hidden-sm hidden-xs action-buttons" style="float: left">'+
                    '<button  class="btn-minier btn btn-primary btn-round" onclick="editModel('+cl+')"><i class="ace-icon fa fa-pencil"></i>编辑</button>&nbsp;&nbsp;' +
                    '<button  class="btn-minier btn btn-danger btn-round" onclick="delInterface('+cl+')"><i class="ace-icon fa fa-trash-o"></i>删除</button>&nbsp;&nbsp;' +
                    '</div>';

                subAndcancelBtn = '<div id="subDiv_'+cl+'" class="hidden-sm hidden-xs action-buttons" style="display: none;">' +
                    '<button class="btn-minier btn btn-success btn-round" onclick="modifyInterface('+cl+')"><i class="ace-icon fa fa-check"></i>提交</button>&nbsp;&nbsp;' +
                    '<button class="btn-minier btn btn-danger btn-round" onclick="cancelEdit('+cl+')"><i class="ace-icon fa fa-remove"></i>取消</button>&nbsp;&nbsp;' +
                    '</div>';

                runAndcaseBtn = '<div id="runDiv_'+cl+'" class="hidden-sm hidden-xs action-buttons" style="float: left">' +
                    '<button class="btn-minier btn btn-success btn-round" onclick="runCase('+cl+')"><i class="ace-icon fa fa-play"></i>执行</button>&nbsp;&nbsp;' +
                    '<button class="btn-minier btn btn-warning btn-round" onclick="caseMamager('+cl+')"><i class="ace-icon fa fa-cog"></i>用例管理</button>' +
                    '</div>';

                $(grid_selector).jqGrid('setRowData', ids[i], { operation : subAndcancelBtn + editAnddelBtn + runAndcaseBtn});
            }
        },

        caption:"接口管理"
    });

    $(window).triggerHandler('resize.jqGrid');
    $("#t_interfaceDetailTable").css({"height":45,"margin":15});
    $("#grid-table-toolbar").appendTo("#t_interfaceDetailTable");
}

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container:'body'});
    $(table).find('.ui-pg-div').tooltip({container:'body'});
}

