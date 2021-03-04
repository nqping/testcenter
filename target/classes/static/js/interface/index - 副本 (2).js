/**
 * Created by qingping.niu on 2018/4/2.
 */
var proxy;
var oTable=null;
var grid_selector = "#interTable";
var pager_selector = "#interPaper";
$(function () {
    drawTable();
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
            //console.log(result);
            if(result !=null && result.errorCode==0){
                $("#addFaceModal").modal('hide');
                $form.resetForm();
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
        postData: {"domainName":$('#domainName').val()},
        prmNames:{id:"interfaceId",search:"search"},//更改参数名称
        ajaxGridOptions : {contentType: "application/json; charset=utf-8"},
        height: "50%",
        colNames: ["编号","域名","接口名","接口地址","用例数","更新时间","管理操作"],
        colModel:[
            {name:"interfaceId",index:'interfaceId',width:50,fixed:true,sortable:true,align:"left"},
            {name:"domainName",index:"domainName",width:250,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceName",index:"interfaceName",width:150,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"interfaceAddress",index:"interfaceAddress",width:300,fixed:true,align:"left",editable:true,edittype:"text",editrules:{required:true}},
            {name:"useCaseCount",index:"useCaseCount",width:100,fixed:true,align:"center"},
            {name:"updateTime",index:"updateTime",width:150,fixed:true,align:"center",
                formatter:function(cellvalue, options, cell){
                    var dt = new Date(cellvalue);
                    return dt.format("yyyy-MM:dd hh:mm:ss");
            }},
            {name:"operation",id:"operation",width:200,align:"left",
                formatter:'actions',
                formatoptions:{
                    keys:true,
                    delOptions:{
                        recreateForm: true,
                        beforeShowForm:beforeDeleteCallback,
                        url:httpPath+"/interface/delete",
                        // delData:{
                        //     interfaceId:function(){
                        //         var rowData = oTable.jqGrid("getGridParam","selrow");
                        //         return rowData;
                        //     }
                        // }
                    },
                    editOptions:{
                        recreateForm: true,
                        editData:{
                            useCaseCount:function(){
                               var rowId = oTable.jqGrid("getGridParam","selrow");
                               var rowData = oTable.jqGrid("getRowData",rowId);
                               return rowData.useCaseCount;
                            }
                        }
                    }

                }}],
        viewrecords: true,
        rowNum:10,
        rowList:[10,20,30],
        rownumbers: false, //不显示行号
        pager : pager_selector,
        altRows: true,
        page:0,
        multiselect: false, //不显示复选框
        multiboxonly: false,
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
        editurl:httpPath+"/interface/modify",
        gridComplete: function () {
            var ids = $(grid_selector).jqGrid("getDataIDs");
            for ( var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                //console.log(cl)
                op1 = '<div id="btnDiv_'+cl+'" style="margin-left:8px;">' +
                    '<div id="jEditBtn_'+cl+'" class="ui-pg-div ui-inline-edit" style="float:left; display: block;"data-original-title="编辑" >' +
                    '<span class="ui-icon ui-icon-pencil" onclick="editModel('+cl+')"></span></div>' +
                    '<div id="jDelBtn_'+cl+'" class="ui-pg-div ui-inline-del" style="float:left; display: block;" data-original-title="删除">' +
                    '<span class="ui-icon ui-icon-trash" onclick="delInterface('+cl+')"></span></div>' +
                    '<div id="jSaveBtn_'+cl+'" class="ui-pg-div ui-inline-save" style="float: left; display: none;" data-original-title="保存" >' +
                    '<span class="ui-icon ui-icon-disk" onclick="modifyInterface('+cl+')"></span></div>' +
                    '<div id="jCancelBtn_'+cl+'" class="ui-pg-div ui-inline-cancel" style="float: left; display: none;" data-original-title="取消">' +
                    '<span class="ui-icon ui-icon-cancel" onclick="cancelEdit('+cl+')"></span></div>' +
                    '</div>';

                runBtn = '<span class="ace-icon fa fa-refresh green"></span>';
                $(grid_selector).jqGrid('setRowData', ids[i], { operation : runBtn});
            }
        },
        caption:"接口管理"
    });
    $(window).triggerHandler('resize.jqGrid');

}

//replace icons with FontAwesome icons like above
function updatePagerIcons(table) {
    var replacement =
        {
            'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
            'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
            'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
            'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
        };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
    })
}

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container:'body'});
    $(table).find('.ui-pg-div').tooltip({container:'body'});
}

function beforeDeleteCallback(e) {
    var form = $(e[0]);
    if(form.data('styled')) return false;
    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
    style_delete_form(form);
    form.data('styled', true);
}

function style_delete_form(form) {
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
    buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
}

function editModel(rowId){
    oTable.jqGrid("editRow",rowId);
    oTable.jqGrid("setSelection",rowId);
    $("#jEditBtn_"+rowId).attr("style","float:left;display:none;");
    $("#jDelBtn_"+rowId).attr("style","float:left;display:none;");
    $("#jSaveBtn_"+rowId).attr("style","float:left;display:block;");
    $("#jCancelBtn_"+rowId).attr("style","float:left;display:block;");
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
        "extraparam" : {interfaceId:rowData.interfaceId,useCaseCount:rowData.useCaseCount},  //提交到服务器的其他附加数据
        "aftersavefunc" :function(rowId,xhrReqObj){
            $("#jEditBtn_"+rowId).attr("style","float:left;display:block;");
            $("#jDelBtn_"+rowId).attr("style","float:left;display:block;");
            $("#jSaveBtn_"+rowId).attr("style","float:left;display:none;");
            $("#jCancelBtn_"+rowId).attr("style","float:left;display:none;");
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

function cancelEdit(rowId) {
    oTable.restoreRow(rowId);
    oTable.jqGrid("restoreRow",rowId);
    $("#jEditBtn_"+rowId).attr("style","float:left;display:block;");
    $("#jDelBtn_"+rowId).attr("style","float:left;display:block;");
    $("#jSaveBtn_"+rowId).attr("style","float:left;display:none;");
    $("#jCancelBtn_"+rowId).attr("style","float:left;display:none;");
}
