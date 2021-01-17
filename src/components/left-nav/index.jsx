import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import {PieChartOutlined, ContainerOutlined,} from '@ant-design/icons';
import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';
import {setHeadTitle} from '../../redux/actions';

const { SubMenu } = Menu;

class LeftNav extends Component{
    hasAuth=(item)=>{
        const {key}=item;
        const userType=this.props.user.type;
        const  menus=this.props.user.menus;
        if(userType==='superadmin' || menus.indexOf(key)!==-1){
            return true;
        }else if(item.children){ //4.如果当前用户有此item的某个子item的权限
            return  !!item.children.find(child=>menus.indexOf(child.key)!==-1); //强制转换为布尔值
        }

    }

    getMenuNodes=(menuList)=>{
        //得到当前请求的路由路径
        const path=this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
            //如果当前用户有Item对应的权限，才需要显示对应的菜单项

           if(this.hasAuth(item)){
               //向pre中添加menu.item 或者SubMenu
               if(!item.children){
                   //判断item是否是当前对应的item
                   if(item.key===path &&path.indexOf(item.key===0)){
                       //设置更新headerTitle状态
                       this.props.setHeadTitle(item.title);
                   }
                   pre.push((
                       <Menu.Item key={item.key} icon={<PieChartOutlined />} >

                           <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                               {item.title}
                           </Link>
                       </Menu.Item>
                   ));

               }else{
                   //查找一个与当前路径匹配的字Item
                   const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
                   //如果存在，那么当前的列表的字列表需要展开
                   if(cItem){
                       this.openKey=item.key;
                   }

                   //添加Submenu
                   pre.push((
                       <SubMenu key={item.key} icon={<ContainerOutlined />} title={item.title}>
                           { this.getMenuNodes(item.children)}
                       </SubMenu>
                   ))

               }
           }
            return pre;
        },[])
    }

    componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList);
    }

    render(){
        //得到当前请求的路由路径
        let path=this.props.location.pathname;
        if(path.indexOf('/product')===0){ //当前请求的是商品或其子路由
            path='/product'
        }
        //得到打开菜单项的key
        const openKey=this.openKey;
        return (
         <div className="left-nav">
             <Link to='/' className='left-nav-header'>
                 <img src={logo} alt="logo"/>
                 <h1>QHSE</h1>
             </Link>
             <div style={{ width: 200 }}>
                 <Menu
                     selectedKeys={[path]}
                     defaultOpenKeys={[openKey]}
                     mode="inline"
                     theme="dark">
                     {
                         this.menuNodes
                     }
                 </Menu>
             </div>
         </div>
     )}
}

export default connect(
    state=>({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav));
