/**
 * Created by qingping.niu on 2018/3/1.
 */
var proxy;
$(function () {
    var $loginForm = $("#loginForm");
    var $email = $loginForm.find("input[name=email]");
    var $password = $loginForm.find("input[name=password]");
    document.onkeydown = function (e) {
        if (e.keyCode == 13) {
            $loginForm.find('button[name=loginBtn]').click();
        }
    };

    $loginForm.find("input[name=rememberMeCheckbox]").on("click",function(event){
        if (event.target.checked) {
            deleteCookie("swapd", "/");
        }
    })

    var adminEmailCookie = getCookieValue("swaem");
    if (adminEmailCookie) {
        $email.val(adminEmailCookie.replace(/"/g, ""));
    }
    var adminPassword = getCookieValue("swapd");
    if (adminPassword) {
        $password.val(adminPassword);
    }
    var fromCookie = false;
    if (adminEmailCookie && adminPassword) {
        $loginForm.find("input[name=rememberMeCheckbox]").attr("checked", "true");
        fromCookie = true;
    }

    $loginForm.find('button[name=loginBtn]').click(function(){
        if (!$email.val() || !isEmail($email.val())) {
            $email.focus();
            bootbox.alert("请输入合法的电子邮箱");
            return;
        }
        if (!$password.val()) {
            $password.focus();
            return;
        }
        var dataJson = {
            "email":$email.val(),
            "password": fromCookie ? adminPassword : $password.val(),
            "remember": $loginForm.find("input[name=rememberMeCheckbox]").prop("checked"),
            "fromCookie": fromCookie
        }
        //var jsonParams = JSON.stringify(dataJson);
        proxy = new jQuery.ms.proxy(errorProcess, httpPath, TYPE_POST);
        proxy.login($.toJSON(dataJson),function(jsonObj){
            if(jsonObj.errorCode == 0 ){
                sessionStorage.setItem("adminEmail", jsonObj.result);
                var adminEmail = jsonObj.result;
                //跳转到首页
                window.location.href = "page/project.html";
            }else{
                bootbox.alert(jsonObj.errorMessage);
            }
        });
    });
});

// function login(){
//     var userName = $("#userName").val().trim();
//     var password = $("#password").val().trim();
//     if(!userName){
//         bootbox.alert("请输入用户名");
//         return false
//     }
//     if(!password){
//         bootbox.alert("请输入密码");
//         return false;
//     }
//     var dataJson = convertFormToJSON("loginForm"); //将表单转换成JSON格式
//     var jsonParams = JSON.stringify(dataJson);
//     proxy = new jQuery.ms.proxy(errorProcess, httpPath, TYPE_POST);
//     proxy.login(jsonParams,function(jsonObj){
//         if(jsonObj != null && jsonObj.errorCode == 0 ){
//             //将数据保存到cookie中
//             setCookie("token",jsonObj.result);
//             //跳转到首页
//             window.location.href = "page/project.html";
//         }else{
//             bootbox.alert(jsonObj.errorMessage);
//         }
//     });
// }



