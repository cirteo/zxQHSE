/*
根据接口文档定义请求格式
*包含应用中所以接口的请求函数模块
* 每个函数的返回值都是promise
 */

import  jsonp from 'jsonp';
import ajax from './ajax';

import {message} from 'antd';

const BASE='';
//登录
//1、 登录请求
export const reqLogin = (account, password) =>ajax('/login', {account, password}, 'POST');

//用户
// 2、添加/ 3、更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/' + (user.id ? 'update' : 'add'), user, 'POST');

// 4、获取所有用户的列表
export const reqUsers=()=>ajax(BASE+'/queryAll');

//5、删除指定用户
export const reqDeleteUsers=(id)=>ajax(BASE+'/delete',{id},'POST');


// 量化表
//6、查询所有量化项
export  const reqEvaluate=()=>ajax('/evaluate');
//7、按照主题|查询量化项
export  const reqEvaluateTheme=(search,searchName)=>ajax('/evaluateTheme',{search,searchName},'POST');

//8、获取量化表中的量化项
export const reqContentList=(account)=>ajax('/querySingleDeliveryForm',{account},'POST');

//9、提交量化表
export const reqDlivery=(account)=>ajax('/uploadDataForm',account,'POST');

// 10、添加\ 11、修改量化项
export  const  reqAddOrUpdateEvaluate=(evaluation)=>ajax(BASE+'/evaluate/'+(evaluation.id?'update':'add'),evaluation,'POST');

//12、发布量化表
export  const  reqPublish=(form)=>ajax('/addDeliveryForm',form,'POST');

//13、查询所有已发布的量化表
export  const  reqPublishAll=()=>ajax('/queryAllDeliveryForm');

//14、根据分类ID获取分类、、、、、
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId});

//15、删除指定名称的图片、、、、、、、、、、、、、、
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST');



// 角色
//16、添加角色列表
export const reqAddRole=(name)=>ajax(BASE+'/addRole',{name},'POST');

//17、获取所有角色的列表
export const reqRoles=()=>ajax('/queryRole');

//18、更新角色
export const reqUpdateRole=(role)=>ajax(BASE+'/updateRole',role,'POST');

//19、添加jsonp请求的接口请求函数
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
