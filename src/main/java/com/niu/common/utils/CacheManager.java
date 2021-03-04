package com.niu.common.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by qingping.niu on 2018/3/13.
 */
public class CacheManager {
    private static Map<String, Cache> cacheMap = new HashMap<String, Cache>();

    public CacheManager() {
        super();
    }

    // 载入缓存
    public static void putCacheInfo(String key, Object obj, long timeOut) {
        Cache cache = new Cache();
        cache.setKey(key);
        cache.setValue(obj);
        cache.setTimeOut(timeOut + System.currentTimeMillis());// 设置多久后缓存过期
        cacheMap.put(key, cache);
    }

    // 根据key取出
    public static Cache getCacheInfo(String key) {

        if (hasCache(key)) {// 是否存在
            Cache cache = getCache(key);
            if (cacheExpired(cache)) { // 是否过期
                clearCache(key);
                return null;
            }
            return cache;
        }
        return null;
    }

    // 获取缓存中的大小
    public static int getCacheSize() {
        return cacheMap.size();
    }

    // 清除指定 key
    public synchronized static void clearCache(String key) {
        cacheMap.remove(key);
    }

    // 清除全部
    public synchronized static void clearAll() {
        cacheMap.clear();
    }

    // 得到缓存。同步静态方法
    private synchronized static Cache getCache(String key) {
        return (Cache) cacheMap.get(key);
    }

    // 判断是否存在一个缓存
    public synchronized static boolean hasCache(String key) {
        return cacheMap.containsKey(key);
    }

    // 判断缓存是否过期
    public static boolean cacheExpired(Cache cache) {
        if (cache == null) {
            return false;
        }
        long nowDt = System.currentTimeMillis(); // 系统当前的毫秒数
        long cacheDt = cache.getTimeOut(); // 缓存内的过期毫秒数
        if (cacheDt <= 0 || cacheDt > nowDt) { // 过期时间小于等于零时,或者过期时间大于当前时间时，则为FALSE
            return false;
        } else { // 大于过期时间 即过期
            return true;
        }
    }
}
