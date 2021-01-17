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
import  axios from 'axios';
import {message} from 'antd';
/*
export  default  function ajax(url,data={},type="GET") {
    return new promise(resole,reject)
    if(type="GET"){//发送get请求
        return axios.get(url,{ //配置对象
            params:data //指定请求参数
        });
    }else{//发送post请求
        return axios.post(url,data);
    }
}
*/
export  default  function ajax(url,data={},type='GET'){
    return new Promise(function (resolve,reject) {

        let promise;
        //执行异步ajax请求

        if(type==="GET"){
            promise=axios.get(url,{params:data});//params 配置指定的是query参数 内置对象
        }else{
            promise=axios.post(url,data);
        }
        promise.then(response=>{
            //成功：调用resolve（response，data)
            resolve(response.data);
        }).catch(error=>{
            //对所有ajax请求出错做统一处理  外层就不用再处理错误了
            //失败：提示后台出错
            message.error("请求出错："+error.message);
        })
    })





   /*
   return new Promise((resolve ,reject)=>{
       let promise;
       //1.执行异步ajax请求
       if(type==='GET'){
           promise = axios.get(url,{ //配置对象
               params:data //指定请求参数
           })
       }else{//发送post请求
           promise = axios.post(url,data);;
       }
       //2.如果成功了，调用resolve（value）
       promise.then(response=>{
            resolve(response.data)
       }).catch(error=>{
            message.error("请求出错"+error.message);
       })
   })*/
}

//请求登录接口
 //ajax('/login',{username:'Tomm',password:'12345'},'POST').then();
//添加用户
// ajax('/manage/user/add',{username:'Tomm',password:'12345',phone:'21333333333'},'POST').then();