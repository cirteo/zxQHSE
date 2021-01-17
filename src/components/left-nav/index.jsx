import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import {PieChartOutlined, ContainerOutlined,DesktopOutlined,MailOutlined,AppstoreOutlined} from '@ant-design/icons';
import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';

import {setHeadTitle} from '../../redux/actions';

const { SubMenu } = Menu;

class LeftNav extends Component{

    /*
    判断当前登录用户对item是否有权限和=
     */
    hasAuth=(item)=>{
        const {key,isPublic}=item;
        const menus=this.props.user.role.menus;
        const username=this.props.user.username;
        /*
        1.如果当前用户是admin
        2.如果当前item是公开的
        3.当前用户有此item的权限：key有没有menus中
         */
        if(username==='admin' ||isPublic || menus.indexOf(key)!==-1){
            return true;
        }else if(item.children){ //4.如果当前用户有此item的某个子item的权限
            return  !!item.children.find(child=>menus.indexOf(child.key)!==-1); //强制转换为布尔值
        }
    }

    //根据menu数组数据生成对应的标签列表
    //使用map()+递归调用
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    return(
                        <Menu.Item key={item.key} icon={<PieChartOutlined />} >
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    return (
                        <SubMenu key={item.key} icon={<ContainerOutlined />} title={item.title}>
                            { this.getMenuNodes_map(item.children)}
                        </SubMenu>
                    )
                }
            }


        })




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

    /*在第一次render之前 执行一次
      为第一个render()准备数据（同步的）
     */
    componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList);
    }

    render(){
       // const menuNodes=this.getMenuNodes_map(menuList);

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
                 <h1>硅谷后台</h1>
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

/*
withRouter 高阶组件

包装非路由组件，返回一个新的组件，新的组件向被包装的组件传递
三个属性：history,location,math
 */

// export default withRouter(LeftNav);
export default connect(
    state=>({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav));
