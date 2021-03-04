var port = "";
if (window.location.port!="") {
	port = ":" + window.location.port;
}
var basePath = window.location.protocol + "//" + window.location.hostname + port;
var contextPath = "/testcenter";
var httpPath = basePath + contextPath;
//var httpsPath = basePath + contextPath;

var VERSION = "TC V1.0";
var TYPE_GET = "GET";
var TYPE_PUT = "PUT";
var TYPE_POST = "POST";
var TYPE_DELETE = "DELETE";



