import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Tree,Input,Form} from 'antd';
import menuList from '../../config/menuConfig';

const Item =Form.Item;
export default class AuthForm extends Component{
    static propTypes={
        role:PropTypes.object
    }

    constructor(props){
            super(props);
            const {menus}=this.props.role;
            this.state={
                checkedKeys:menus,
            }
    }

     onCheck = checkedKeys=> {
       this.setState({checkedKeys})
         console.log("选择的",this.state.checkedKeys);
    };

    //为父组件提供最新的menus
    getMenus=()=>this.state.checkedKeys;
    /*
    最新传入的role来更新checkedKeys的状态
    当前组件接受到新的属性的时候自动调用
    */
    componentWillReceiveProps(nextProps,nextContent){
        const menus=nextProps.role.menus;
        this.setState({
            checkedKeys: menus
        })
    }
    render(){
        const {role}=this.props;
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15},
        }
        return (
            <div>
                <Item {...formItemLayout} label={'角色名称'}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpantAll={true}
                    treeData={menuList}
                    checkedKeys={this.state.checkedKeys}
                    onCheck={this.onCheck}>
                </Tree>
            </div>
        )
    }
}

