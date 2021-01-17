/*
*能发送异步ajax请求的函数模块
* 封装axios库
* 函数的返回值是promise对象
*
* 封装ajax请求模块
*
* 优化1：统一处理请求异常---:
*      在外层包一个自己创建的promise对象
*      在请求出错的时候。不请求reject，而是显示error.message
*
* 优化2：异步得到的不是response，而是response.data
**/

import {message} from 'antd';
import {get,post} from  './until';

export  default  function ajax(url,data={},type='GET') {
    return new Promise(function (resolve, reject) {

        let promise;
        //执行异步ajax请求

        if (type === "GET") {
            promise = get(url, {params: data});//params 配置指定的是query参数 内置对象
        } else {
            promise = post(url, data);
        }
        promise.then(response => {
            //成功：调用resolve（response，data)
            resolve(response.data);
        }).catch(error => {
            message.error("请求出错：" + error.message);
        })
    })
}



