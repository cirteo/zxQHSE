import React,{Component} from 'react';
import  {Redirect,Route,Switch} from 'react-router-dom';
import { Layout, } from 'antd';
import  {connect} from 'react-redux';


import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home';

import  Role from "../role/role";
import  User from "../user/user";
import NotFound from '../not-found/not-found';
import NotDevelopment from '../not-found/not-development';
import Evaluate from "../evaluate/evaluate";
import Publish from "../publish/home";
import Write from "../write/home";

/*
 后台管理的路由组件
 */

const {Footer, Sider, Content } = Layout;
class Admin extends Component{
 render(){
     //读取保存的用户信息-----------
     const user=this.props.user;
     //如果内存中没有存储user 当前没有登录
     if(!user || !user.id){
         //自动跳转到登录接界面  在render函数中用 Redirect
         return  <Redirect to='/login'/>
     }
     return (
         <Layout style={{ minHeight: '100%' }}>
             <Sider>
                 <LeftNav/>
             </Sider>
             <Layout>
                 <Header>Header</Header>
                 <Content style={{margin:20,backgroundColor:'white'}}>
                     <Switch>
                         <Redirect exact from='/' to='/home'/>
                         <Route path='/home' component={Home} />
                         <Route path='/evaluate' component={Evaluate}/>
                         <Route path='/publish' component={Publish}/>
                         <Route path='/write' component={Write}/>
                         <Route path='/check' component={NotDevelopment}/>
                         <Route path='/check/checking' component={NotDevelopment}/>
                         <Route path='/check/problem' component={NotDevelopment}/>
                         <Route path='/role' component={Role}/>
                         <Route path='/user' component={User}/>
                         <Route  component={NotFound}/>

                     </Switch>
                 </Content>
                 <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验。</Footer>
             </Layout>
         </Layout>
     )
     }
}

export default connect(
    state=>({user:state.user}),
    {}
)(Admin);

