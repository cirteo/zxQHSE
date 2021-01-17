
import React,{Component} from 'react';
import {message} from 'antd';
import {BrowserRouter,Route,Switch,HashRouter} from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
/*
应用的根组件
 */
export  default class extends Component {

    // handleClick=()=>{
    //     message.success("这个成功来~");
    // }
    render(){
        return(
            <HashRouter>
                {/*只匹配其中的一个*/}
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </HashRouter>
        )
    }
}
