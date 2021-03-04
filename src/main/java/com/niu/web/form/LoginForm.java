package com.niu.web.form;

/**
 * Created by qingping.niu on 2018/3/5.
 */
public class LoginForm {
    private int id;
    private String password;
    private String email;

    /**
     * 是否记住当前管理员登录信息, 包括电子邮箱和密码
     */
    private boolean remember = false;
    /**
     * 登录信息是否来自于cookie
     */
    private boolean fromCookie = false;

    public boolean isRemember() {
        return remember;
    }

    public void setRemember(boolean remember) {
        this.remember = remember;
    }

    public boolean isFromCookie() {
        return fromCookie;
    }

    public void setFromCookie(boolean fromCookie) {
        this.fromCookie = fromCookie;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
