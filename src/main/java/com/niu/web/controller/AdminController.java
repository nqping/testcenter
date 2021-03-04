package com.niu.web.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.niu.common.BusinessConstant;
import com.niu.common.QueryModel;
import com.niu.common.exception.TCException;
import com.niu.common.utils.JsonMapper;
import com.niu.entity.Admin;
import com.niu.services.AdminService;
import com.niu.web.form.LoginForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/3/5.
 */
@Controller
@RequestMapping("/admin")
public class AdminController extends ExceptionHandlerAdvice {
    /**
     * cookie路径
     */
    private static final String COOKIE_PATH = "/";
    /**
     * 管理员电子邮箱cookie名字
     */
    private static final String COOKIE_NAME_EMAIL = "swaem";
    /**
     * 管理员密码cookie名字
     */
    private static final String COOKIE_NAME_PASSWORD = "swapd";

    @Value("${client.cookie.max-age}")
    private int cookieMaxAge;

    @Autowired
    private AdminService adminService;

    /**
     * 登录页
     */
    @RequestMapping("/login")
    public void showLogin(HttpServletResponse response, HttpServletRequest request)
            throws IOException {
        String loginUrl = request.getContextPath() + BusinessConstant.LOGIN_PAGE_HTML;
        System.out.println("+++++"+loginUrl);
        response.sendRedirect(loginUrl);
    }

    @RequestMapping(value="/login",method = RequestMethod.POST)
    @ResponseBody
    public Object login(@RequestBody String jsonParams){
        if(jsonParams == null){
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }

        JsonNode node = null;
        LoginForm loginForm = new LoginForm();
        try {
            node = JsonMapper.nonEmptyMapper().getMapper().readTree(jsonParams);
            loginForm.setEmail(node.get("email").asText());
            loginForm.setPassword(node.get("password").asText());
            loginForm.setFromCookie(node.get("fromCookie").booleanValue());
            loginForm.setRemember(node.get("remember").asBoolean());
        } catch (IOException e) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        Admin admin;
        if(loginForm.isFromCookie()){
            admin = adminService.findByEmail(loginForm.getEmail());
            // 管理员存在, 但密码不正确
            if(admin != null && !(admin.getPassword().equals(loginForm.getPassword()))){
                admin = null;
                // 删除密码cookie
                Cookie cookie = new Cookie(COOKIE_NAME_PASSWORD, null);
                cookie.setPath(COOKIE_PATH);
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }else{
            //不需要记住登录
            admin = adminService.findUserByEmailAndPassword(loginForm.getEmail(),loginForm.getPassword());
        }
        if(admin !=null){
            request.getSession().setAttribute(BusinessConstant.LOGIN_ADMIN_SESSION_KEY, admin);
            Cookie emailCookie = new Cookie(COOKIE_NAME_EMAIL, admin.getEmail());
            emailCookie.setPath(COOKIE_PATH);
            emailCookie.setMaxAge(cookieMaxAge);
            response.addCookie(emailCookie);
            // 若管理员设置了记住登录信息, 且本次登录信息不是来自于cookie, 而是手动输入, 则为其保存密码
            if (loginForm.isRemember() && !loginForm.isFromCookie()) {
                // 将密码进行混淆后存放在客户端cookie中
                Cookie passwordCookie = new Cookie(COOKIE_NAME_PASSWORD, admin.getPassword());
                passwordCookie.setMaxAge(cookieMaxAge);
                passwordCookie.setPath(COOKIE_PATH);
                response.addCookie(passwordCookie);
            }
            result = admin.getEmail();
        }else{
            throw new TCException(USER_LOGIN_ERROR,USER_LOGIN_ERROR_MESSAGE);
        }
        return model();
    }

    @RequestMapping(value = "/list",method = RequestMethod.POST)
    @ResponseBody
    public Object list(@RequestBody String jsonParams) {
        if (jsonParams == null) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        JsonNode node;
        int currentPage = 0;//当前页
        int pageSize = 0; //每页显示行数
        QueryModel queryModel = new QueryModel();
        try{
            node = JsonMapper.nonDefaultMapper().getMapper()
                    .readTree(jsonParams);
            currentPage = node.get("page").asInt(); //当前页
            pageSize = node.get("rows").asInt(); //每页显示行数

        }catch (IOException e){
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        queryModel.setCurrentPage(currentPage);
        queryModel.setPageSize(pageSize);
        List adminList = adminService.findAdminList(queryModel);
        Map<String, Object> data = new HashMap<String, Object>();

        data.put("rows",adminList); //数据集
        data.put("page",queryModel.getCurrentPage());//当前页
        data.put("total",queryModel.getTotalPage());//总页数
        data.put("records",queryModel.getRecordTotal());//总记录数
        result = data;
        return model();
    }

    @RequestMapping(value="/delete",method = RequestMethod.DELETE)
    @ResponseBody
    public Object delete(@RequestBody String jsonParams){
        if (jsonParams == null) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        JsonNode node = null;
        String userId = null;
        try {
            node = JsonMapper.nonEmptyMapper().getMapper().readTree(jsonParams);
        } catch (IOException e) {
            throw new TCException(PARAMETER_ERROR, PARAMETER_ERROR_MESSAGE);
        }
        if (!node.get("userId").isNull()) {
            userId = node.get("userId").asText();
        }
        String [] ids = userId.split(",");
        result = adminService.deleteAdminById(ids);
        return model();
    }


    @RequestMapping(value="/modify",method = RequestMethod.POST)
    @ResponseBody
    public Object modify(Admin admin){
        result = adminService.updateAdmin(admin);
        return model();
    }

    @RequestMapping(value = "/userall",method = RequestMethod.POST)
    @ResponseBody
    public Object getUserAll(){
        List<Admin> userList = adminService.getUserAll();
//        Map<String, Object> data = new HashMap<String, Object>();
//        data.put("userAll", userList);
        result = userList;
        return model();
    }

    @RequestMapping(value="/logout",method=RequestMethod.GET)
    public void logout(HttpServletRequest request) throws IOException{
        Enumeration<String> attrNames = request.getSession().getAttributeNames();
        while (attrNames.hasMoreElements()) {
            request.getSession().removeAttribute(attrNames.nextElement());
        }
        System.out.println(request.getContextPath() + BusinessConstant.LOGIN_PAGE_HTML);
        response.sendRedirect(request.getContextPath() + BusinessConstant.LOGIN_PAGE_HTML);

    }


}
