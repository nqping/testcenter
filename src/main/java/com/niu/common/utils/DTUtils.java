package com.niu.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by qingping.niu on 2018/4/4.
 */
public class DTUtils {

    private static Logger log = LoggerFactory.getLogger(DTUtils.class);

    private static final String[] FORMATS = { "yyyy-MM-dd", "yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm:ss", "HH:mm",
            "HH:mm:ss", "yyyy-MM" };

    public static Date convert(String str) {
        if (str != null && str.length() > 0) {
            if (str.length() > 10 && str.charAt(10) == 'T') {
                str = str.replace('T', ' '); // 去掉json-lib加的T字母
            }
            for (String format : FORMATS) {
                if (str.length() == format.length()) {
                    try {
                        log.debug("convert " + str + " to date format " + format);
                        Date date = new SimpleDateFormat(format).parse(str);
                        log.debug("****" + date + "****");
                        return date;
                    } catch (ParseException e) {
                        log.warn(e.getMessage());
                    }
                }
            }
        }
        return null;
    }
    /**
     * 取得当前时间
     *
     * @return 当前时间
     */
    public static Date getNow() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 求两个日期中较小的日期
     *
     * @param date1
     *            ，date2
     * @return 返回小日期
     * @since 0.1
     */
    public static Date getSmallDate(Date date1, Date date2) {
        return date1.compareTo(date2) < 0 ? date1 : date2;
    }

    /**
     * 求两个日期中较大的日期
     *
     * @param date1
     *            ，日期2
     * @return 返回大日期
     * @since 0.1
     */
    public static Date getBigDate(Date date1, Date date2) {
        return date1.compareTo(date2) > 0 ? date1 : date2;
    }

    /**
     * 在给定日期上增减月份
     *
     * @param monthAmount
     *            月数
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addMonth2Date(int monthAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.MONTH, monthAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 在给定日期上增减天数
     *
     * @param dayAmount
     *            天数
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addDay2Date(int dayAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DAY_OF_MONTH, dayAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 在给定日期上增减小时
     *
     * @param hourAmount
     *            小时
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addHour2Date(int hourAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.HOUR_OF_DAY, hourAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 在给定日期上增减分钟数
     *
     * @param minuteAmount
     *            分钟
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addMinute2Date(int minuteAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.MINUTE, minuteAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串(只含有年月日)
     *
     * @param  date 待格式的日期
     * @return 本地日期形式的字符串。例1783-12-29
     * @since 0.1
     */
    public static String formatDate2NN(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
            int month = calendar.get(Calendar.MONTH) + 1;
            if (month < 10) {
                dateBuffer.append("0" + month + "-");
            } else {
                dateBuffer.append(month + "-");
            }
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            if (day < 10) {
                dateBuffer.append("0" + day + " ");
            } else {
                dateBuffer.append(day + " ");
            }
        }
        return dateBuffer.toString();
    }

    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串(含有年月日时分)
     *
     * @param date 待格式的日期
     * @return 本地日期形式的字符串。1783-12-29 08:05
     * @since 0.1
     */
    public static String formatDateTime2NN(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
            int month = calendar.get(Calendar.MONTH) + 1;
            if (month < 10) {
                dateBuffer.append("0" + month + "-");
            } else {
                dateBuffer.append(month + "-");
            }
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            if (day < 10) {
                dateBuffer.append("0" + day + " ");
            } else {
                dateBuffer.append(day + " ");
            }
            dateBuffer.append(StringUtils.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + ":");
            dateBuffer.append(StringUtils.formatNumber(calendar.get(Calendar.MINUTE), 2, '0'));
        }
        return dateBuffer.toString();
    }

    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串（含有年月日时分秒)
     *
     * @param date 待格式的日期
     * @return 本地日期形式的字符串。例1783-12-29 08:05:12
     * @since 0.1
     */
    public static String formatFullDateTime2NN(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
            int month = calendar.get(Calendar.MONTH) + 1;
            if (month < 10) {
                dateBuffer.append("0" + month + "-");
            } else {
                dateBuffer.append(month + "-");
            }
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            if (day < 10) {
                dateBuffer.append("0" + day + " ");
            } else {
                dateBuffer.append(day + " ");
            }
            dateBuffer.append(StringUtils.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + ":");
            dateBuffer.append(StringUtils.formatNumber(calendar.get(Calendar.MINUTE), 2, '0') + ":");
            dateBuffer.append(StringUtils.formatNumber(calendar.get(Calendar.SECOND), 2, '0'));
        }
        return dateBuffer.toString();
    }

    /**
     * 将字符串解析成日期类型，如果字符串/则按/解析,否则按-解析
     *
     * @param dateStr 待解析的字符串
     * @return 解析后的日期
     * @since 0.1
     */
    public static Date getDate(String dateStr) {
        Date date = null;
        try {
            if (dateStr != null) {
                String separator = dateStr.indexOf('/') > 0 ? "/" : "-";
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy" + separator + "MM" + separator + "dd");
                date = simpleDateFormat.parse(dateStr);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return date;
    }

    /**
     * 将字符串解析成日期时间类型，如果字符串/则按/解析,否则按-解析
     *
     * @param dateTimeStr
     *            待解析的字符串
     * @return 解析后的日期
     */
    public static Date getDateTime(String dateTimeStr) {
        Date date = null;
        try {
            String separator = dateTimeStr.indexOf('/') > 0 ? "/" : "-";
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy" + separator + "MM" + separator
                    + "dd HH:mm:ss");
            date = simpleDateFormat.parse(dateTimeStr);
        } catch (Exception e) {
            log.warn(e.getMessage());
        }
        return date;
    }

    /**
     * 取得传入日期的年
     *
     * @param date
     * @return 该日期的年份
     * @since 0.1
     */
    public static int getYear(Date date) {
        Calendar c = java.util.Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.YEAR);
    }

    /**
     * 取得传入日期的月
     *
     * @param date
     * @return 该日期的月份
     * @since 0.1
     */
    public static int getMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.MONTH) + 1;
    }

    /**
     * 取得传入日期的日
     *
     * @param date
     * @return 该日期的月份
     * @since 0.1
     */
    public static int getday(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.DATE);
    }

    /**
     * 取得传入日期的小时
     *
     * @param date
     * @reture该日期的小时数
     */
    public static int getHour(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * 取得传入日期的分钟数24小时
     *
     * @param date
     * @return
     */
    public static int getMinute(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.MINUTE);
    }

    /**
     * 两个日期的月份差
     *
     * @param fromDate 起始日期
     *            ，结束日期
     * @return 两日期的月分差，如1998-4-21~1998-6-21 相差两个月份 返回2
     * @since 0.1
     */
    public static int getDiffMonth(Date fromDate, Date toDate) {
        Calendar c = Calendar.getInstance();
        c.setTime(fromDate);
        int fromYear = c.get(Calendar.YEAR);
        int fromMonth = c.get(Calendar.MONTH) + 1;
        c.setTime(toDate);
        int toYear = c.get(Calendar.YEAR);
        int toMonth = c.get(Calendar.MONTH) + 1;
        int monthCount = 0;

        if (toYear == fromYear) {
            monthCount = toMonth - fromMonth;
        } else if (toYear - fromYear == 1) {
            monthCount = 12 - fromMonth + toMonth;
        } else {
            monthCount = 12 - fromMonth + 12 * (toYear - fromYear - 1) + toMonth;
        }
        return monthCount;
    }

    /**
     * 两个日期的天数差
     *
     * @param fromDate 起始日期
     *            ，结束日期
     * @return 两日期的月分差，如1998-4-21~1998-4-25 相差4天 返回4
     * @since 0.1
     */
    public static int getDiffDays(Date fromDate, Date toDate) {
        return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * 两个日期的小时差
     *
     * @param fromDate 起始日期
     *            ，结束日期
     * @return 两日期的小时差
     * @since 0.1
     */
    public static int getDiffHours(Date fromDate, Date toDate) {
        return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60));
    }

    /**
     * 两个日期的分钟差
     *
     * @param fromDate 起始日期
     *            ，结束日期
     * @return 两日期的分钟差
     * @since 0.1
     */
    public static int getDiffMinute(Date fromDate, Date toDate) {
        return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60));
    }

    public static String getTimeStampId() {
        Calendar c = Calendar.getInstance();
        int iYear = c.get(Calendar.YEAR);
        int iMon = c.get(Calendar.MONTH) + 1;
        int iDay = c.get(Calendar.DAY_OF_MONTH);
        int iHour = c.get(Calendar.HOUR_OF_DAY);
        int iMin = c.get(Calendar.MINUTE);
        int iSec = c.get(Calendar.SECOND);
        String s = String.valueOf(iYear);
        if (iMon < 10)
            s += "0";
        s = s + String.valueOf(iMon);
        if (iDay < 10)
            s += "0";
        s = s + String.valueOf(iDay);
        if (iHour < 10)
            s += "0";
        s = s + String.valueOf(iHour);
        if (iMin < 10)
            s += "0";
        s = s + String.valueOf(iMin);
        if (iSec < 10)
            s += "0";
        s = s + String.valueOf(iSec);
        return s;
    }

    public static String getTimeStamp() {
        Calendar c = Calendar.getInstance();
        int iYear = c.get(Calendar.YEAR);
        int iMon = c.get(Calendar.MONTH) + 1;
        int iDay = c.get(Calendar.DAY_OF_MONTH);
        int iHour = c.get(Calendar.HOUR_OF_DAY);
        int iMin = c.get(Calendar.MINUTE);
        int iSec = c.get(Calendar.SECOND);
        String s = String.valueOf(iYear);
        s += "-";
        if (iMon < 10)
            s += "0";
        s = s + String.valueOf(iMon);
        s += "-";
        if (iDay < 10)
            s += "0";
        s = s + String.valueOf(iDay);
        s += " ";
        if (iHour < 10)
            s += "0";
        s = s + String.valueOf(iHour);
        s += ":";
        if (iMin < 10)
            s += "0";
        s = s + String.valueOf(iMin);
        s += ":";
        if (iSec < 10)
            s += "0";
        s = s + String.valueOf(iSec);
        return s;
    }

    public static int getDayOfWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        return dayOfWeek;
    }

    public static int getDayOfMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);
        return dayOfMonth;
    }

    /**
     * 数字日期转化为时间字符串
     *
     * @param time
     *            File
     * @return String yyyy-MM-dd HH:mm:ss
     */
    public static String getLongToDate(long time) {
        String sDate = "";
        Date date = new Date(time);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sDate = simpleDateFormat.format(date);
        return sDate;
    }

    /**
     * 将一个日期字符串转化成日期格式
     *
     * @param sDate
     *            String
     * @return Date
     */
    public static Date switchStringToDate(String sDate, String format) {
        Date date = null;
        try {
            SimpleDateFormat df = new SimpleDateFormat(format);
            date = df.parse(sDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 将一个日期字符串转化成日期格式
     *
     * @param sDate
     *            String
     * @return Date yyyy-mm-dd
     */
    public static Date switchStringToDate4Log(String sDate) {
        Date date = switchStringToDate(sDate, "yyyy-MM-dd");
        return date;
    }

    /**
     * 取得系统当前时间
     *
     * @return String yyyy-MM-dd
     */
    public static String getCurrentDate4Log() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String time = simpleDateFormat.format(date);
        return time;
    }

    /**
     * 将一个日期字符串转化成Calendar
     *
     * @param sDate
     *            String
     * @return Calendar
     */
    public static Calendar switchStringToCalendar4Log(String sDate) {
        Date date = switchStringToDate4Log(sDate);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c;
    }

    /**
     * 取得某个时间前n提
     *
     * @param sDate
     *            String
     * @param n
     *            int
     * @return String yyyy-mm-dd HH:mm:ss
     */
    public static String getNDayBeforeOneDate4Log(String sDate, int n) {
        Calendar c = switchStringToCalendar4Log(sDate);
        if (n != 0) {
            c.add(Calendar.DAY_OF_MONTH, -n);
        }
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH) + 1;
        int day = c.get(Calendar.DATE);
        return (year > 999 ? "" : "0") + year + "-" + (month > 9 ? "" : "0") + month + "-" + (day > 9 ? "" : "0") + day;
    }

    /**
     * 格式转换 <li>date转换成pattern格式
     *
     * @param pattern
     * @param date
     * @return
     */
    public static String switchDate2String(String pattern, Date date) {
        SimpleDateFormat format = null;
        try {
            format = new SimpleDateFormat(pattern);
        } catch (Exception e) {
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
        return format.format(date);
    }

    /**
     * 将一个日期字符串转化成Calendar
     *
     * @param sDate
     *            String
     * @return Calendar
     */
    public static Calendar switchStringToCalendar(String sDate) {
        Date date = switchStringToDate(sDate);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c;
    }

    /**
     * 将一个日期字符串转化成日期
     *
     * @param sDate
     *            String
     * @return Date yyyy-mm-dd HH:mm:ss
     */
    public static Date switchStringToDate(String sDate) {
        Date date = switchStringToDate(sDate, "yyyy-MM-dd HH:mm:ss");
        return date;
    }

    /**
     * 取得系统当前时间
     *
     * @return String yyyy-mm-dd
     */
    public static String getCurrentDate() {
        Calendar rightNow = Calendar.getInstance();
        int year = rightNow.get(Calendar.YEAR);
        int month = rightNow.get(Calendar.MONTH) + 1;
        int day = rightNow.get(Calendar.DATE);
        return (year > 999 ? "" : "0") + year + "-" + (month > 9 ? "" : "0") + month + "-" + (day > 9 ? "" : "0") + day;
    }

    /**
     * 取得系统当前时间
     *
     * @return String yyyyMMddHhmmss
     */
    public static String getCurrentDate4() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        java.util.Date date = new java.util.Date();
        String time = simpleDateFormat.format(date);
        return time;
    }

    /**
     * 取得系统当前时间
     *
     * @return String yyyy-MM-dd HH:mm:ss
     */
    public static String getCurrentDate5() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        String time = simpleDateFormat.format(date);
        return time;
    }

    public static void main(String []args){
    }





}
