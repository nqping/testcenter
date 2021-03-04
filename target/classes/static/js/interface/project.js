/**
 * Created by qingping.niu on 2018/4/13.
 */
//定义参数常量
var oTable=null;
var grid_selector = "#projectTable";
var pager_selector = "#projectPaper";
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

    //form表单验证并提交

    $('#projectForm').bootstrapValidator({
        fields:{
            projectName:{
                validators:{
                    notEmpty:{
                        message:'项目名称不能为空'
                    }
                }
            },
            leader:{
                validators:{
                    notEmpty:{
                        message:'负责人不能为空'
                    },
                    callback:{
                        message:'负责人不能为空',
                        callback:function(value,validator){
                            console.log(value);

                        }
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data("bootstrapValidator");
        $.post(httpPath+"/project/add",$form.serialize(),function (result) {
            if(result !=null && result.errorCode==0){
                $("#addProjectModal").modal('hide');
                $form.resetForm();
                oTable.trigger("reloadGrid");
            }
        },'json');
    });

    // $("#createTimeTemp").datetimepicker(
    //     {
    //         format:'yyyy-mm-dd hh:ii:ss' ,
    //         language:'zh-CN',
    //         autoclose:true,
    //         todayBtn:true,
    //         weekStart:true,
    //         startView:2,
    //         todayHighlight:true,
    //         forceParse:false,
    //         showMeridian:false // 显示上午和下午选择
    //
    //     });
});


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
    var project_name = $("#projectNameTemp").val();
    oTable = $(grid_selector).jqGrid({
        url: httpPath+"/project/list",
        mtype: "post",
        datatype : "json",
        prmNames:{id:"projectId",search:"search"},//更改参数名称
        postData:{"projectName":project_name,"status":$("#statusTemp").val()},
        ajaxGridOptions : {contentType: "application/json; charset=utf-8"},
        height: "50%",
        colNames: ["编号","名称","负责人","状态","当前版本","创建时间","创建者","描述","管理操作"],
        colModel:[
            {name:"projectId",index:'projectId',width:50,fixed:true,align:"left"},
            {name:"projectName",index:"projectName",width:250,fixed:true,align:"left"},
            {name:"leader",index:"leader",width:150,fixed:true,align:"left"},
            {name:"status",index:"status",width:70,fixed:true,align:"left"},
            {name:"version",index:"version",width:100,fixed:true,align:"left"},
            {name:"updateTime",index:"updateTime",width:150,fixed:true,align:"left",
                formatter:function (cellvalue, options, cell) {
                    var dt = new Date(cellvalue);
                    return dt.format("yyyy-MM:dd hh:mm:ss");
            }},
            {name:"creator",index:"creator",width:100,fixed:true,align:"left"},
            {name:"remark",index:"remark",width:200,fixed:true,align:"left"},
            {name:"operation",index:"operation",width:250,fixed:true,align:"left"}
        ],
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
            id:"projectId" //rowId与后台id对应
        },
        loadComplete: function(){
            var table = this;
            setTimeout(function(){
                updatePagerIcons(table);
                //enableTooltips(table);
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
                    '<button class="btn-minier btn btn-warning btn-round" onclick="interfaceManager('+cl+')"><i class="ace-icon fa fa-cog"></i>接口管理</button>' +
                    '</div>';

                $(grid_selector).jqGrid('setRowData', ids[i], { operation : subAndcancelBtn + editAnddelBtn + runAndcaseBtn});
            }
        },
        caption:"项目管理"
    });
    $(window).triggerHandler('resize.jqGrid');
    $("#t_projectTable").css({"height":50,"margin":15});
    $("#grid-table-toolbar").appendTo("#t_projectTable");
}

function loadList(){
    oTable.trigger("reloadGrid");
}

function showAddPanl(){

    $.post(httpPath+"/admin/userall",function (rsObj,status) {
        if(rsObj != null && rsObj.errorCode == 0){
            var userObj = rsObj.result;
            for(var i=0;i<userObj.length;i++){
                var option = $('<option>').text(userObj[i].userName).val(userObj[i].userName);
                $('#leader').append(option);
            }

            $("#leader").chosen({style:'width:100%'});

            // $("#leader").multiselect({
            //     // 自定义参数，按自己需求定义
            //     nonSelectedText : "--请选择--",
            //     allSelectedText:"已全选",
            //     selectAllText:"全选",
            //     numberDisplayed: 1,
            //     buttonWidth: "100%",
            //     maxHeight:200,
            //     disableIfEmpty: true,
            //     disabledText: '没有数据',
            //     includeSelectAllOption : true, //全选按钮
            //     numberDisplayed : 4,
            //
            // });
        }
    });

   // $('#leader').multiselect();

    $("#addProjectModal").modal("show").draggable();
}
function test() {
    var leader = $("#leader").val();
}

function interfaceManager(rowId){
    var rowData = oTable.jqGrid("getRowData",rowId);
    window.location.href = httpPath+'/page/interface/interfaceDetails.html?pname='+rowData.projectName;
}