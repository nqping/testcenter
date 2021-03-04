package com.niu.config;

import org.springframework.core.annotation.Order;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

/**
 * Created by qingping.niu on 2018/3/13.
 */
@Order(1)
@WebFilter(filterName = "encodingFilter",urlPatterns = "/*")
public class CharacterEncodingFilter implements Filter {
    public void destroy() {
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=UTF-8");
        filterChain.doFilter(request, response);

    }

    public void init(FilterConfig config) throws ServletException {
        System.out.println("encodingFilter --- init");
        System.setProperty("file.encoding", "utf-8");
    }

}
