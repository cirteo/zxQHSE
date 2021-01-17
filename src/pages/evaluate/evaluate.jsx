import React,{Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import  EvaluateHome from './home';
import  EvaluateAddUpdate from './add-update';
import './evaluate.less';
/*
商品路由
 */
export default class Evaluate extends Component{
 render(){
     return (
     <Switch>
          <Route path='/evaluate' component={EvaluateHome} exact />   {/*路径完全匹配  exact*/}
          <Route path='/evaluate/addupdate' component={EvaluateAddUpdate}/>

          <Redirect to='/evaluate'/>

     </Switch>
     )
     }
}
