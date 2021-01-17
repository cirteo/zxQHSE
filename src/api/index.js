/*
根据接口文档定义请求格式
*包含应用中所以接口的请求函数模块
* 每个函数的返回值都是promise
 */

// export default {
//
// }
import  jsonp from 'jsonp';
import ajax from './ajax';

import {message} from 'antd';

// export default  function(){}  统一暴露
// export function  分别暴露
//登录
// export  function reqLogin(username,password) {
// return ajax('/login',{username,password},"POST")
// }
/*
 (username, password) =>ajax()这种传值，要求参数的顺序一致    但是名字都必须与接口参数中的名字一样
 ({pageNum,pageSize,searchName,searchType})=>ajax()这种传值，要求传入的值的参数名字一致，不要求顺序 但是名字都必须与接口参数中的名字一样
 */

// const BASE='/api';
const BASE='';
export const reqLogin = (username, password) =>ajax(BASE+'/login', {username, password}, 'POST');

//添加用户
export const reqAddUser=(user)=>ajax(BASE+'/manage/user/add',user,"POST");

//一般情况下 查询数据用的是get  对后台的数据有所改变，用的是post
//获取分类的列表 一级/二级
export  const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId});

//添加分类
export  const reqAddCategorys=(categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST');

//更新分类
export  const reqUpdateCategorys=(categoryId,categoryName)=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST');

//获取商品分页列表
export  const  reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize});

//获取一个分类---------info?????????
//根据分类ID获取分类
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId});

//更新商品的状态（上架/下架）
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST');


/*搜索商品分页列表 根据商品名称
 searchType  根据商品的类型 productName,productDesc
 */
export const  reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
});

//删除指定名称的图片
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST');

// 添加\修改商品
export  const  reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST');
//修改商品
export  const  reqUpdateProduct=(product)=>ajax(BASE+'/manage/product/update',product,'POST');

//--------------rose
//获取所有角色的列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list');

//添加角色列表
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST');

//更新角色
export const reqUpdateRole=(roleName)=>ajax(BASE+'/manage/role/update',roleName,'POST');

// 获取所有用户的列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list');

//删除指定用户
export const reqDeleteUsers=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST');

//添加用户
//export const reqAddUser=(user)=>ajax('/manage/user/add',user,'POST');

// 更新用户
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST');


//添加jsonp请求的接口请求函数
export  function reqWeather(city){

    return new Promise((resolve,reject)=>{
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=ddabaa8c1eb3426a2159761c4562e90b`;
        jsonp(url,{},(err,data)=>{
            // console.log(err,data);
            //请求成功
            if(!err&&data.info==="OK"){
                //取出需要的数据
                const {dayPictureUrl,weather}=data.lives[0];
                // console.log(data.lives[0].province);
                resolve({dayPictureUrl,weather})
            }else{
                // 请求失败
                message.error("获取天气信息失败！");
            }
    })

})

}
// reqWeather(110101);


/*
*Jsonp解决ajax跨域的原理：

1.jsonp只能解决GET类型的ajax请求跨域问题
2.Jsonp请求不是ajax请求，而是一般的get请求
3.基本原理：
浏览器端：
  动态生成<script>来请求后台接口(src就是接口的url）
定义好用于接收响应数据的函数（fn），并将函数名通过请求参数提交给后台（如：callback=fn）
服务器端：
  接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用

浏览器端：
收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据。
*/
