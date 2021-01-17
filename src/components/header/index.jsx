import React,{Component} from 'react';

import './index.less';
import {reqWeather} from '../../api';
import  menuList from '../../config/menuConfig'
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import  {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import  LinkButton from '../link-button'
import {logout} from '../../redux/actions'
import  {Modal} from 'antd';

/*
左侧导航栏
 */
 class Header extends React.Component{
    //当前组件的状态
    state={
        currentTime:formateDate(Date.now()),//当前时间字符串
        dayPictureUrl: '',//天气的图片url
        weather:''//天气的文本

    }


    getTime=()=>{
        //每隔一秒获取当前的时间，并更新状态数据currentTime
       this.intervaId=setInterval(()=>{
           const currentTime=formateDate(Date.now());
           this.setState({currentTime})
       },1000)

    }

    getWeather=async  ()=>{
        //调用接口请求异步获取数据
        const {dayPictureUrl,weather} = await reqWeather(110101)
        //更新状态
        this.setState({dayPictureUrl,weather})
    }

    getTitle=()=>{
        //得到当前请求的路径
        const path =this.props.location.pathname;
        let title;
        menuList.forEach(item=>{
            if(item.key===path){//如果当前的item对象的key与path一样，item的title就是需要显示的title
                title=item.title;
            }else if(item.children){
                //在所有的子item中查找匹配
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0);
                if(cItem){
                    title=cItem.title;
                }
            }
        })
        return title;
    }

     logout=()=>{
        //显示确认框
         Modal.confirm({
             title:'确定退出？',

             onOk:()=>{
                 console.log("OK",this);
                 /*//删除保存的user数据
                    storageUtils.removeUser();
                    memoryUtils.user={};

                 // 跳转到login页面
                 this.props.history.replace('/login');*/
                 this.props.logout();  //没有数据的时候，会自动退出登录 发生跳转
             },
             onCancel(){
                 console.log("Cancel");
             }
         })

     }

     //在第一render之后执行  一般在此执行异步操作：发送请求、启动计时器
    componentDidMount(){
        this.getTime();
        //获取当前天气的显示
        this.getWeather();

    }

    //在当前组件卸载之前调用
    componentWillUnmount(){
        // 清除定时器
        clearInterval(this.intervaId);
    }

 render(){
        const {currentTime,dayPictureUrl,weather}=this.state;
        const user=this.props.user.username;

        //取出 所得到的需要显示的title
        // const title=this.getTile();
        const title=this.props.headTitle;

     return (
     <div className="header">
         <div className="header-top">
             <span>欢迎 {user}</span>
             <LinkButton onClick={this.logout}>退出</LinkButton>
         </div>
         <div  className="header-bottom">
             <div className="header-bottom-left">{title}</div>
             <div className="header-bottom-right">
                 <span>{currentTime}</span>
                 <img src="http://api.map.baidu.com/images/weather/day/qing.png"alt="weather"/>
                 <span>{weather}</span>
             </div>
         </div>
     </div>
     )
     }
}

export  default  connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header));