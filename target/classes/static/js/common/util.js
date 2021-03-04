/**
 * Created by qingping.niu on 2018/3/1.
 */
//需要使用默认值时使用（当属性无输入数据时，生成默认值替代）
function convertFormToJSON(formName) {
    var formObj = $('#' + formName);
    var serializeObj = {};
    var array = $(formObj).serializeArray();
    $(array).each(
        function() {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [ serializeObj[this.name], this.value ];
                }
            } else {
                serializeObj[this.name] = this.value || ' ';
            }
        });
    return serializeObj;
};

//不需要使用默认值时使用（当属性无输入数据时，不会生成替代值）
function simpleConvertFormToJSON(formName) {
    var formObj = $('#' + formName);
    var serializeObj = {};
    var array = $(formObj).serializeArray();
    $(array).each(
        function() {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [ serializeObj[this.name], this.value ];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
    return serializeObj;
};

function arrayConvertToJSON(array) {
    var serializeObj = {};
    $(array).each(
        function() {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [ serializeObj[this.name], this.value ];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
    return serializeObj;
};



String.prototype.trim = function() {
    var t = this.replace(/(^\s*)|(\s*$)/g, "");
    return t.replace(/(^　*)|(　*$)/g, "");
};
// Object.prototype.showModal = function (title,message,btn1,btn2,param) {
//     var htmlstr = '<div id="delmodinterDiv" class="ui-jqdialog ui-widget ui-widget-content ui-corner-all" dir="ltr" ' +
//         'style="width: 240px; height: auto; z-index: 1050; overflow: hidden; top: 161px; left: 199px; display: block;" ' +
//         'tabindex="-1" role="dialog" aria-labelledby="delhdinterTable" aria-hidden="false">' +
//         '<div id="delhdinterTable" class="ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" style="cursor: move;">' +
//         '<div class="widget-header"><span class="ui-jqdialog-title" style="float: left;">'+title+'</span>' +
//         '<a class="ui-jqdialog-titlebar-close ui-corner-all" style="right: 0.3em;">' +
//         '<span class="ui-icon ui-icon-closethick"></span> </a> ' +
//         '</div>' +
//         '</div>' +
//         '<div id="delcntgrid-table" class="ui-jqdialog-content ui-widget-content"></div>' +
//         '</div>';
// }

/**
 * 判断参数email是否是一个合法的电子邮箱
 *
 * @param email 电子邮箱 (比较宽松的验证)
 * @returns {boolean} 若参数email是一个合法的电子邮箱, 返回true; 否则返回false
 */
function isEmail(email) {
    var emailReg = /\w+[@]\w+[.]\w+/;
    if (email) {
        return emailReg.test(email);
    }
    return false;
}

// //email格式验证(比较严格的验证)
// function isEmail(value){
//     var pattern =/^[a-zA-Z0-9_\-]{1,}@[a-zA-Z0-9_\-]{1,}\.[a-zA-Z0-9_\-.]{1,}[a-zA-Z0-9]{1,}$/;
//     if(value!=""){
//         if(!pattern.exec(value)){
//             return false;
//         }
//     }
//     return true;
// }

/**
 * 添加cookie
 * hours为空字符串时, cookie的生存期至浏览器会话结束;
 * hours为数字0时, 建立的是一个无效的cookie, 这个cookie会覆盖已经建立过的同名、 同path的cookie（如果这个cookie存在）
 *
 * @param name cookie名字
 * @param value cookie值
 * @param hours 失效时间, 单位小时
 * @param path cookie路径
 */
function setCookie(name, value, hours, path) {
    name = encodeURI(name);
    value = decodeURI(value);
    var expireTime = new Date();
    expireTime.setTime(expireTime.getTime() + hours * 3600000);
    path = path == "" ? "" : ";path=" + path;
    var expires = (typeof hours) == "string" ? "" : ";expires=" + expireTime.toUTCString();
    document.cookie = name + "=" + value + expires + path;
}
/**
 * 获取cookie值
 *
 * @param name cookie名字
 * @returns {string} 若存在指定名字的cookie, 返回该cookie的值; 否则返回空串
 */
function getCookieValue(name) {
    name = encodeURI(name);
    // 读取文档的所有cookie
    var allCookies = document.cookie;
    // 查找名为name的cookie的开始位置
    name += "=";
    var cookiePosition = allCookies.indexOf(name);
    if (cookiePosition != -1) {
        var startPosition = cookiePosition + name.length; // cookie值开始的位置
        var endPosition = allCookies.indexOf(";", startPosition); // 从cookie值开始的位置起搜索第一个";"的位置, 即cookie值结尾的位置
        if (endPosition == -1) { // 如果endPosition的值为-1, 说明cookie列表里只有一个cookie
            endPosition = allCookies.length;
        }
        var value = allCookies.substring(startPosition, endPosition); // 提取cookie的值
        return decodeURI(value); // 解码
    } else {// 未找到cookie, 返回空字符串
        return "";
    }
}

/**
 * 删除cookie
 *
 * @param name cookie名字
 * @param path cookie路径
 */
function deleteCookie(name, path) {
    name = encodeURI(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}

//得到url参数值
function getUrlParam(param) {
    var re = new RegExp("(\\\?|&)" + param + "=([^&]+)(&|$)", "i");
    var m = window.location.href.match(re);
    if (m) {
        return decodeURIComponent(m[2]);
    } else {
        return '';
    }
}

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }
    if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(2) + ' KB';
}

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

/*
 * 判断用户是否登录
 * 3001 未登陆  4001没有权限 5001登录超时
 */
function errorProcess(errorCode, errorMsg) {
    if (errorCode == 3001 || errorCode == 5001) {
        window.location.href = '/login.html';

    } else if (errorCode == 4001) {
        alert(errorCode+":"+errorMsg);
    }
}

