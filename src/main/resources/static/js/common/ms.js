/**
 * Created by qingping.niu on 2018/2/12.
 */
(function($){
    jQuery.ms = {
        /**
         * 私有回调函数
         */
        privateCallBack: function (jsonObj, callBack, errorCallBack) {
            if (callBack == null || callBack == undefined) {
                if (jsonObj.errorCode == 0) {
                    return jsonObj;
                } else {
                    errorCallBack(jsonObj.errorCode, jsonObj.errorMessage);
                }
            } else {
                // 3001 未登陆 4001没有权限 5001登录超时
                if (jsonObj.errorCode != 3001 && jsonObj.errorCode != 4001
                    && jsonObj.errorCode != 5001) {
                    callBack(jsonObj);
                } else {
                    errorCallBack(jsonObj.errorCode, jsonObj.errorMessage);
                }
                return null;
            }
        },
        /**
         * 通讯方法 param: url 请求URL param: json 请求参数 为JSON 对象 param: type
         * HTTP请求方法，GET、PUT、POST、DELETE等 param: callBack 如果callBack 为空 那代表的是同步调用
         * 否则为异步调用 param: errorCallBack 异常回调函数 return: jsonObject 返回json 对象
         */
        communications: function (url, json, type, callBack, errorCallBack) {
            var jsonObj = null;
            $.ajax({
                url: url,
                data: json,
                type: type,// 请求自定义，GET、PUT、POST、DELETE
                contentType: 'application/json',// 默认就支持JSON
                dataType: 'json',
                async: false,
                cache: true,
				// beforeSend : function(xhr) {
				// 	xhr.setRequestHeader("Authorization", getCookie("token"));
				// },
                success: function (data) {
                    jsonObj = jQuery.ms.privateCallBack(data, callBack,
                        errorCallBack);
                },
                error: function (xmlReqObj, textStatus, errorThrown) {
                    throw new Error(errorThrown);
                }
            });
            return jsonObj;
        },

        communications_bug: function (url, json, type, callBack, errorCallBack) {
            var jsonObj = null;
            $.ajax({
                url: url,
                data: json,
                type: type,// 请求自定义，GET、PUT、POST、DELETE
                contentType: 'application/json',// 默认就支持JSON
                dataType: 'json',
                async: true,
                cache: false,
				// beforeSend : function(xhr) {
				// 	xhr.setRequestHeader("Authorization", getCookie("token"));
				// },
                success: function (data) {
                    jsonObj = jQuery.ms.privateCallBack(data, callBack,
                        errorCallBack);
                },
                error: function (xmlReqObj, textStatus, errorThrown) {
                    throw new Error(errorThrown);
                },
                complete: function () {
                    // 数据加载完毕，取消等待画面的遮罩效果
                    //$.unblockUI();
                }
            });
            return jsonObj;
        },

        /**
         * proxy 代理类 param: errorCallBack 全局异常回调函数
         */
        proxy: function (errorCallBack, basePath, type) {
            var basePathURL = basePath;
            var loginURL = basePathURL + "/admin";
            this.login = function (jsonParams, callBack) {
                try {
                    var jsonObj = jQuery.ms.communications(loginURL+"/login",
                        jsonParams, type, callBack, errorCallBack);
                    return jsonObj;
                } catch (e) {
                    errorCallBack(100000, e.message);
                }
            };

            this.deleteAdmin = function(jsonParams,param,callBack){
                try {
                    var jsonObj = jQuery.ms.communications(loginURL+param,
                        jsonParams, type, callBack, errorCallBack);
                    return jsonObj;
                } catch (e) {
                    errorCallBack(100000, e.message);
                }
            };
            this.modifyAdmin = function(jsonParams,callBack){
                try {
                    var jsonObj = jQuery.ms.communications(loginURL+"/modify",
                        jsonParams, type, callBack, errorCallBack);
                    return jsonObj;
                } catch (e) {
                    errorCallBack(100000, e.message);
                }
            };
            // this.logout = function (jsonParams,callBack) {
            //     try {
            //         var jsonObj = jQuery.ms.communications_bug(loginURL+"/logout",
            //             jsonParams, type, callBack, errorCallBack);
            //         return jsonObj;
            //     } catch (e) {
            //         errorCallBack(100000, e.message);
            //     }
            // }


            // this.timerRefreshCheckResultList = function(jsonParams,callBack){
            //     try {
            //         var jsonObj = jQuery.ttc.communications(scanappResultURL+"/timerRefresh/list",
            //             jsonParams, type, callBack, errorCallBack);
            //         return jsonObj;
            //     } catch (e) {
            //         errorCallBack(100000, e.message);
            //     }
            // };
        }

    };

})(jQuery);