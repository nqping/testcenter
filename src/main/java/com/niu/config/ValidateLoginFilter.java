package com.niu.config;

import com.niu.common.utils.Cache;
import com.niu.common.utils.CacheManager;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by qingping.niu on 2018/3/13.
 */
@WebFilter(filterName = "loginFilter",urlPatterns = "/*")
public class ValidateLoginFilter implements Filter {
    private Logger logger = LoggerFactory.getLogger(ValidateLoginFilter.class);
    public void destroy() {
    }

    public void doFilter(ServletRequest servletRequest , ServletResponse servletResponse, FilterChain chain) throws ServletException, IOException {
       //System.out.println("validateloginfilter");
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
//        //获取请求路径
//        String uri = request.getRequestURI();
//        String contextPath = request.getContextPath();
//
//        if (StringUtils.containsIgnoreCase(uri,"/index")
//                || StringUtils.containsIgnoreCase(uri, "/AdminLTE")
//                || StringUtils.containsIgnoreCase(uri, "/admin/login")
//                || StringUtils.containsIgnoreCase(uri, "/download")
//                || StringUtils.containsIgnoreCase(uri, "/api/third")
//                || StringUtils.containsIgnoreCase(uri, "/third")
//                || StringUtils.containsIgnoreCase(uri, "/login.html")
//                || StringUtils.containsIgnoreCase(uri, "/policy.html")
//                || StringUtils.containsIgnoreCase(uri, "/css")
//                || StringUtils.containsIgnoreCase(uri, "/font")
//                || StringUtils.containsIgnoreCase(uri, "/images")
//                || StringUtils.containsIgnoreCase(uri, "/js")) {
//            chain.doFilter(request, response);
//
//        // 获取用户token
//        String token = request.getHeader("Authorization");
//        String method = request.getMethod();
//        logger.info("Http request method：" + method);
//        logger.info("Http request Header：" + token);
//        if(token == null){ //未登录
//
//        }else{
//            // 已登录 ,验证请求url 有无权限
//            Cache userCache = CacheManager.getCacheInfo(token);
//            if(userCache == null){ //会话过期
//                PrintWriter out = response.getWriter();
//                response.setContentType("application/json;charset=UTF-8");
//                String json = "{\"result\":null,\"errorCode\":5001,\"errorMessage\":\"会话过期\"}";
//                out.write(json);
//                out.flush();
//                out.close();
//            }else{
//
//            }
//        }

        chain.doFilter(request, response);
    }

    public void init(FilterConfig config) throws ServletException {

    }

}
