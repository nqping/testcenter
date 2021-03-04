/**
 * Created by qingping.niu on 2018/4/2.
 */
var proxy;
var oTable=null;
var grid_selector = "#interTable";
var pager_selector = "#interPaper";
$(function () {
    drawTable();
    loadPorjectList();
    //设置modal对话框头部可以拖动(全局有效)
    $(document).on("show.bs.modal", ".modal", function(){
        // $(this).draggable({
        //     handle: ".modal-header"   // 只能点击头部拖动
        // });
        $(this).draggable(); //整个modal 任意空白处都可以拖动
        $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
    });
    $('#interfaceForm').bootstrapValidator({
        fields:{
            domainName:{
                validators:{
                    notEmpty:{
                        message:'域名不能为空'
                    },
                    stringLength:{
                        max:100,
                        message:'最多输入100字符'
                    }
                }
            },
            interfaceName:{
                validators:{
                    notEmpty:{
                        message:'接口名不能为空'
                    },
                    stringLength:{
                        max:100,
                        message:'最多输入100字符'
                    }
                }
            },
            interfaceAddress:{
                validators:{
                    notEmpty:{
                        message:'接口名不能为空'
                    },
                    stringLength:{
                        max:200,
                        message:'最多输入200字符'
                    }
                }

            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data("bootstrapValidator");
        $.post(httpPath+"/interface/add",$form.serialize(),function (result) {
            if(result !=null && result.errorCode==0){
                $("#addFaceModal").modal('hide');
                $form.resetForm();
                oTable.trigger("reloadGrid");
            }
        },'json');
    });
});
function searchInterface() {
    oTable.trigger("reloadGrid");
}
function drawTable() {
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
        postData: {"domainName":$('#domainName').val(),"projectName":$('#projectNameTemp').val()},
        prmNames:{id:"interfaceId",search:"search"},//更改参数名称
        ajaxGridOptions : {contentType: "application/json; charset=utf-8"},
        height: "50%",
        colNames: ["编号","域名","接口名","接口地址","请求方式","数据传输方式","用例数","更新时间","管理操作"],
        colModel:[
            {name:"interfaceId",index:'interfaceId',width:50,fixed:true,sortable:true,align:"left"},
            {name:"domainName",index:"domainName",width:220,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceName",index:"interfaceName",width:150,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceAddress",index:"interfaceAddress",width:230,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"requestType",index:"requestType",width:70,fixed:true,align:"left"},
            {name:"dataType",index:"dataType",width:100,fixed:true,align:"left"},
            {name:"useCaseCount",index:"useCaseCount",width:50,fixed:true,align:"center"},
            {name:"updateTime",index:"updateTime",width:150,fixed:true,align:"center",
                formatter:function(cellvalue, options, cell){
                    var dt = new Date(cellvalue);
                    return dt.format("yyyy-MM:dd hh:mm:ss");
                }},
            {name:"operation",id:"operation",width:150,align:"left"}],
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
        subGrid:true,
        subGridOptions : {
            plusicon : "ace-icon fa fa-plus center bigger-110 blue",
            minusicon  : "ace-icon fa fa-minus center bigger-110 blue",
            openicon : "ace-icon fa fa-chevron-right center orange"
        },
        subGridRowExpanded:function(subgridDivId, row_id){
            var rowData = oTable.jqGrid("getRowData",row_id);
            var subgridTableId = subgridDivId + "_t";
            var subTableTemp = $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
            subTableTemp.append('<tr height="50px;"><td><b>接口说明:</b></td><td>'+rowData.interfaceId+'</td></tr>');
            subTableTemp.append('<tr height="50px;"><td><b>归属项目:</b></td><td>'+rowData.projectName+'</td></tr>');
        },
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
    $("#t_interTable").css({"height":100,"margin":15});
    $("#grid-table-toolbar").appendTo("#t_interTable");
}

//replace icons with FontAwesome icons like above

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container:'body'});
    $(table).find('.ui-pg-div').tooltip({container:'body'});
}

function editModel(rowId){
    oTable.jqGrid("editRow",rowId);
    oTable.jqGrid("setSelection",rowId);

    $("#editDiv_"+rowId).attr("style","display:none");
    $("#runDiv_"+rowId).attr("style","display:none");
    $("#subDiv_"+rowId).attr("style","float:left;display:block;");
}

function modifyInterface(rowId){
    var rowData = oTable.jqGrid("getRowData",rowId);
    saveparameters = {
        "successfunc" : function(xhrReqObj){
            var data = xhrReqObj.responseText;
            var jsonData = JSON.parse(data);
            if(xhrReqObj.status == 200 && jsonData.errorCode == 0){
                return true;
            }
        }, //将在成功请求后触发（200状态，动态页没有发生错误）
        "url" : httpPath+"/interface/modify",
        "extraparam" : {useCaseCount:rowData.useCaseCount},  //提交到服务器的其他附加数据
        "aftersavefunc" :function(rowId,xhrReqObj){
            $("#editDiv_"+rowId).attr("style","float:left;");
            $("#runDiv_"+rowId).attr("style","float:left");
            $("#subDiv_"+rowId).attr("style","display:none;");
        } , //数据保存到服务器返回客户端后触发。此事件参数为rowid和xhr对象
        "errorfunc": function (rowId,xhrReqObj) {
            bootbox.alert("状态:"+xhrReqObj.status+" "+xhrReqObj.statusText);
        },
        "afterrestorefunc" : null,//调用restoreRow还原数据行原始信息（数据行保存不成功）时触发
        "restoreAfterError" : true,
        "mtype" : "POST"
    };
    oTable.jqGrid("saveRow",rowId,saveparameters);
}

function delInterface(rowId){
    bootbox.confirm({
        title:"删除",
        message:"删除选中行?",
        buttons:{
            confirm:{
                lable:"确定"
            },
            cancel:{
                lable:"取消"
            }
        },
        callback:function (result) {
            if(result){
                $.ajax({
                    url:httpPath+"/interface/delete",
                    type:'POST',
                    dataType:'json',
                    data:{"interfaceId":rowId},
                    success:function (data, textStatus, jqXHR) {
                        if(data != null && data.errorCode == 0){
                            oTable.trigger("reloadGrid");
                        }else{
                            bootbox.alert(data.errorMessage);
                        }
                    },
                    error:function (data, textStatus, jqXHR) {
                        bootbox.alert(jqXHR);
                    }
                });
            }else{
                return;
            }
        }
    });
}

function expandedSubPanel(rowId){
    oTable.expandSubGridRow(rowId);
}

function cancelEdit(rowId) {
    oTable.restoreRow(rowId);
    oTable.jqGrid("restoreRow",rowId);
    $("#editDiv_"+rowId).attr("style","float:left;");
    $("#runDiv_"+rowId).attr("style","float:left");
    $("#subDiv_"+rowId).attr("style","display:none;");
}

function showAddPanel() {
    $.post(httpPath+"/project/allname",function(rsObj){
        if(rsObj.errorCode == 0){
            var proObj = rsObj.result;
            $('#projectName').empty();
            for(var i=0;i<proObj.length;i++){
                var option = $('<option>').text(proObj[i].projectName).val(proObj[i].projectName);
                $('#projectName').append(option);
            }
        }
    });
    $('#addFaceModal').modal('show').draggable();
}

function loadPorjectList() {
    $.post(httpPath+"/project/allname",function(rsObj){
        if(rsObj.errorCode == 0){
            var proObj = rsObj.result;
            $('#projectNameTemp').empty();
            for(var i=0;i<proObj.length;i++){
                var option = $('<option>').text(proObj[i].projectName).val(proObj[i].projectName);
                $('#projectNameTemp').append(option);
            }
        }
    });
}

function caseMamager(rowId){
    var rowData = oTable.jqGrid("getRowData",rowId);
    var params = new Array();
    params.push(rowData.interfaceId);
    params.push(rowData.interfaceName);
    params.push(rowData.interfaceAddress);
    console.log(params);
}