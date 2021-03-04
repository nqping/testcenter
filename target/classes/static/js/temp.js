/**
 * Created by qingping.niu on 2018/3/20.
 */
var proxy;
var oTable =null;
var grid_selector = "#interTable";
var pager_selector = "#interPaper";

$(function(){

    drawTable()
$("#adminForm").bootstrapValidator({
    fields:{
        email:{
            validators:{
                notEmpty:{
                    message: "邮件地址不能为空"
                },
                emailAddress:{
                    message:"不是一个有效邮件地址"
                },
                stringLength:{
                    min:6,
                    max:32,
                    message:"邮件地址最大32个字符"
                }
            }
        },
        password:{
            validators:{
                notEmpty:{
                    message:"密码不能为空"
                },
                stringLength:{
                    min:6,
                    max:32,
                    message:"密码必须大于6，长度小于30个字符"
                }
            }
        },
        remark:{
            validators:{
                stringLength:{
                    max:100,
                    message:"最多100字符"
                }
            }
        }
    }
}).on("success.form.bv",function(e){
    e.preventDefault();
    var $form = $(e.target);
    var bv = $form.data("bootstrapValidator");
    var dataJson = arrayConvertToJSON($form.serializeArray());
    var jsonParams = JSON.stringify(dataJson);

    proxy = new jQuery.ms.proxy(errorProcess, httpPath, TYPE_POST);
    proxy.modifyAdmin(jsonParams,function(rsObj){
        if(rsObj !=null && rsObj.errorCode == 0){
            $("#modifyModal").modal("hide");
            oTable.trigger("reloadGrid");
        }else{
            bootbox.alert(rsObj.errorMessage);
        }
    });
});

    //设置modal对话框头部可以拖动(全局有效)
    // $(document).on("show.bs.modal", ".modal", function(){
    //     // $(this).draggable({
    //     //     handle: ".modal-header"   // 只能点击头部拖动
    //     // });
    //     $(this).draggable(); //整个modal 任意空白处都可以拖动
    //     $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
    // });
});

/**
 * 创建表格
 */
function drawTable(){
    var parent_column = $(grid_selector).closest('[class*="col-"]');
    //resize to fit page size
    $(window).on('resize.jqGrid', function () {
        $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
    })

    //resize on sidebar collapse/expand
    $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
        if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
            //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
            setTimeout(function() {
                $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
            }, 20);
        }
    });
    oTable =$(grid_selector).jqGrid({
        url: httpPath+"/admin/list",
        mtype: "post",
        datatype : "json",
        ajaxGridOptions : {contentType: "application/json; charset=utf-8"},
        height: '50%',
        colNames : ["操作","编号","邮箱","密码","备注"],
        colModel : [
            {name:'id',index:'id',width:100,fixed:true,sortable:true},
            {name:'email',index:'email',width:200,fixed:true,editable:true,edittype:"text"},
            {name:'password',index:'password',width:200,fixed:true,editable:true,edittype:"text",editoptions:{size:6,maxlength:32},editrules:{required:true,minValue:6,maxValue:32}},
            {name:'remark',index:'remark',width:100,editable:true,edittype:"textarea",editoptions:{rows:"2",cols:"10"}},
            {name:'act',index:'act', width:80, fixed:true, sortable:false, resize:false}
            ],
        viewrecords: true,
        rowNum:10,
        rowList:[10,20,30],
        rownumbers: true,
        pager : pager_selector,
        altRows: true,
        page:0,
        multiselect: false,
        multiboxonly: false,
        serializeGridData: function(postData){
            return JSON.stringify(postData);
        },
        jsonReader:{
            root:"result.rows",// json中代表实际模型数据的入口
            records:"result.records",//查询出的记录数
            total:"result.total", //总页数
            page:"result.page",//当前页
            //id:"result.id"

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
                console.log(cl)
                btn1 = '<div id="btnDiv_'+cl+'" style="margin-left:8px;">' +
                    '<div id="jEditBtn_'+cl+'" class="ui-pg-div ui-inline-edit" style="float:left; display: block;" data-original-title="编辑">' +
                    '<span class="ui-icon ui-icon-pencil" onclick="editModel('+cl+')"></span></div>' +
                    '<div id="jDelBtn_'+cl+'" class="ui-pg-div ui-inline-del" style="float:left; display: block;" data-original-title="删除">' +
                    '<span class="ui-icon ui-icon-trash" onclick="delAdmin('+cl+')"></span></div>' +
                    '<div id="jSaveBtn_'+cl+'" class="ui-pg-div ui-inline-save" style="float: left; display: none;" data-original-title="保存">' +
                    '<span class="ui-icon ui-icon-disk" onclick="modifyAdmin('+cl+')"></span></div>' +
                    '<div id="jCancelBtn_'+cl+'" class="ui-pg-div ui-inline-cancel" style="float: left; display: none;" data-original-title="取消">' +
                    '<span class="ui-icon ui-icon-cancel" onclick="cancelEdit('+cl+')"></span></div>' +
                    '</div>';
                $(grid_selector).jqGrid('setRowData', ids[i], { act : btn1});
            }
        },
        caption: "用户信息"
    });
    $(window).triggerHandler('resize.jqGrid');
    /**
     * 设置默认导航条按钮为fase
     */
   var myNavGrid = $(grid_selector).jqGrid("navGrid",pager_selector,{
        edit: false,
        add: false,
        del: false,
        search: true
    },{},{},{},{multipleSearch:true});
    /**
     *  增加自定义按钮——add按钮
     *  参数1：导航条div名称
     *  caption：按钮名称，可以为空
     *  buttonicon：按钮的图标，string类型，必须为jquery UI theme图标
     *  position: //first或者last，按钮位置
     *  onClickButton：点击该按钮时候的操作
     */
    myNavGrid.navButtonAdd(pager_selector,{
        caption:"",
        title:"删除选中行",
        buttonicon:"ace-icon fa fa-trash-o red",
        position:"first",
        onClickButton:function () {
            var rowIds = $(grid_selector).jqGrid("getGridParam","selarrrow");
            console.log(rowIds)
            if(rowIds == ""){
                bootbox.alert("请选择要删除的行");
            }else{
                deleteBatch(rowIds);
            }
        }
    })
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

function editModel(id) {
    oTable.jqGrid("editRow",id);
    oTable.jqGrid("setSelection",id);
    $("#jEditBtn_"+id).attr("style","float:left;display:none;");
    $("#jDelBtn_"+id).attr("style","float:left;display:none;");
    $("#jSaveBtn_"+id).attr("style","float:left;display:block;");
    $("#jCancelBtn_"+id).attr("style","float:left;display:block;");
    // var model = oTable.jqGrid("getRowData",id);
    // $("#modifyModal").modal("show").draggable(); //显示并可以拖动

}

function cancelEdit(id){
    oTable.restoreRow(id);
    oTable.jqGrid("restoreRow",id);
    $("#jEditBtn_"+id).attr("style","float:left;display:block;");
    $("#jDelBtn_"+id).attr("style","float:left;display:block;");
    $("#jSaveBtn_"+id).attr("style","float:left;display:none;");
    $("#jCancelBtn_"+id).attr("style","float:left;display:none;");
}

function deleteBatch(ids){
   //console.log(ids.toString());
    var jsonParams = {'userId':ids.toString()};
    proxy = new jQuery.ms.proxy(errorProcess, httpPath, TYPE_DELETE);
    proxy.deleteAdmin($.toJSON(jsonParams),"/delete",function(rsObj){
        if(rsObj != null && rsObj.errorCode == 0){
            //oTable.jqGrid("delRowData",id);
            oTable.trigger("reloadGrid");
        }else{
            bootbox.alert(rsObj.errorMessage);
        }
    });

}
function delAdmin(id){
    // delparameters = {
    //     top: 200,
    //     left: 400,
    //     reloadAfterSubmit:false,
    //     modal: true,
    //     url: httpPath+"/admin/delete",    //覆盖editUrl
    //     jqModal: true,
    //     mtype:"POST",
    //     //beforesubmit:null,
    //     beforeSubmit: function(postData, formid){// id=value1,value2,...
    //         var editData = {
    //             "id": "1,2,3"
    //         };
    //         postData = $.extend(postData, editData);
    //         console.log("--------------");
    //         console.log(postData);
    //         return[true,"success"];
    //     },
    //     afterSubmit:function(xhr, postData){   //返回[success, message, new_id]
    //         //console.log("==============");
    //         //console.log(postData);
    //         if(xhr.status== 200){
    //             return [true,"删除成功",postData.id];  //message is ignored if success is true
    //         }
    //         return [false,"删除失败",postData.id];
    //     }
    // };
    // oTable.jqGrid("delGridRow",id,delparameters);

    var jsonParams = {'userId':id};
    proxy = new jQuery.ms.proxy(errorProcess, httpPath, TYPE_DELETE);
    proxy.deleteAdmin($.toJSON(jsonParams),"/delete",function(rsObj){
        if(rsObj != null && rsObj.errorCode == 0){
            //oTable.jqGrid("delRowData",id);
            oTable.trigger("reloadGrid");
        }else{
            bootbox.alert(rsObj.errorMessage);
        }
    });
}

function modifyAdmin(id){
    saveparameters = {
        "successfunc" : function(xhrReqObj){
            //console.log(xhrObj.responseText)
            //console.log(status.status)
            if(xhrReqObj.status == 200){
                return true;
            }
        }, //将在成功请求后触发（200状态，动态页没有发生错误）
        "url" : httpPath+"/admin/modify",
        "extraparam" : {},  //提交到服务器的其他附加数据
        "aftersavefunc" :function(rowId,xhrReqObj){
            $("#jEditBtn_"+rowId).attr("style","float:left;display:block;");
            $("#jDelBtn_"+rowId).attr("style","float:left;display:block;");
            $("#jSaveBtn_"+rowId).attr("style","float:left;display:none;");
            $("#jCancelBtn_"+rowId).attr("style","float:left;display:none;");
        } , //数据保存到服务器返回客户端后触发。此事件参数为rowid和xhr对象
        "errorfunc": function (rowId,xhrReqObj) {
            // console.log(rowId);
            // console.log(xhrReqObj);
            var data = xhrReqObj.responseText;
            var jsonData = JSON.parse(data);
            console.log("****"+jsonData.errorMessage);
            bootbox.alert("状态:"+xhrReqObj.status+" "+xhrReqObj.statusText);
        },
        "afterrestorefunc" : null,//调用restoreRow还原数据行原始信息（数据行保存不成功）时触发
        "restoreAfterError" : true,
        "mtype" : "POST"
    };
    oTable.jqGrid("saveRow",id,saveparameters);

}





