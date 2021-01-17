import React,{Component} from 'react';
import {PAGE_SIZE} from '../../utils/constants';
import {connect} from 'react-redux';
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd';

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api';
import AuthForm from './auth-form';
import AddForm from './add-form';
import  {formateDate} from '../../utils/dateUtils';
import {logout} from '../../redux/actions';

/*
角色
 */
class Role extends Component{
    state={
        roles:[], //所有角色的列表
        role:{},  //开始选中的角色role  为空===说明一开始没有选中任何role
        isShowAdd:false,   //是否显示添加界面
        isShowAuth:false,  //是否显示设置角色权限页面
    }
    constructor(props){
        super(props);
        this.auth=React.createRef();
    };

    //初始数据 函数
    initColumns=()=>{
        this.cloumns=[
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                //render:(create_time)=>formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    };

    onRow=(role)=>{
        return {
            onClick:event=>{ //点击运行
                this.setState({
                    role
                })
            },
        }
    };

    getRoles= async ()=>{
        const result=await reqRoles();
        console.log(" reqRoles();",result);
        //请求成功
        if(result.status===0){
            const roles=result.data;
            this.setState({
                roles
            })
        }

    };

    // 添加角色
    addRole=()=>{
        //进行表单验证，只有通过了才继续进行，也就是说添加的数据不能为空或者不符合要求
        this.form.current.validateFields().then( async value=>{ //then、、、、两个参数 |返回的value就是input框输入的值
            //隐藏确认框
            this.setState({
                isShowAdd:false
            })
               //收集输入的数据
               const {roleName}=value;
                //清除数据
            this.form.current.resetFields();
               //请求添加
                const result=await reqAddRole(roleName);
                console.log(" reqAddRole(roleName);",result);
               //根据结果提示/更新显示
                if(result.status===0){
                    //添加成功，显示最新的列表
                    // this.getRoles();
                    //新产生的角色
                    const role=result.data;

                    this.setState(state=>({ //对象语法是函数语法的简洁写法
                        roles:[...state.roles,role]
                    }));
                    this.setState({
                        isShowAdd:false
                    })
                    message.success("添加成功！");
                }else{
                    message.error("添加角色失败！");
                }
        })
    };

    //更新角色
    updateRole=async ()=>{
        //隐藏确认框
        this.setState({
            isShowAuth:false
        })
        const role=this.state.role;
        //得到最新的menus
        const menus=this.auth.current.getMenus();

        role.menus=menus.toString();
        role.auth_time= formateDate(Date.now());
         // role.auth_name=this.props.user.username;
        role.auth_name=this.props.user.username;
        //请求更新
        const result=await  reqUpdateRole(role);
        console.log(" reqUpdateRole(role);",result)
        if(result.status===0){

            // this.getRoles();
            //如果当前更新的是自己角色权限，强制退出
            if(role.name===this.props.user.type){
                this.props.logout();
                message.success('当前用户角色权限修改，请重新登录！');
            }
            message.success('设置角色权限成功');
            this.setState({
                roles:[...this.state.roles]
            })
        }else {
            message.error("设置角色权限失败~");
        }

    }

    componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){
        this.getRoles();
    }

    render(){
        const {roles,role,isShowAdd,isShowAuth}=this.state;

        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;
                <Button type='primary' disabled={!role.id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
            <Table
                bordered
                rowKey='id'
                dataSource={roles}
                columns={this.cloumns}
                pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
                rowSelection={{
                    type:'radio',
                    selectedRowKeys:[role.id],
                    onSelect:(role)=>{
                        this.setState({
                            role
                        })
                    }

                }}
                onRow={this.onRow}
            />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={
                        ()=>{
                            this.setState({ isShowAdd:false });
                            this.form.current.resetFields();
                        }
                    }
                >
                    <AddForm
                        setForm={(form)=>{this.form=form}}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={
                        ()=>{
                            this.setState({ isShowAuth:false });
                        }
                    }
                >
                    <AuthForm
                        role={role}
                        ref={this.auth}
                    />

                </Modal>
            </Card>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {logout}
)(Role);
