import React,{Component} from 'react';
import {Card,Button,Table,Modal,message} from 'antd';
import  {formateDate} from '../../utils/dateUtils';
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddOrUpdateUser, reqDeleteUsers, reqUsers} from "../../api";
import UsersForm from './user-form';

/*
用户路由
 */
export default class User extends Component{
    state={
        users:[],//所有用户列表
        roles:[], //所有角色的列表
        isShow:false, ///标识是否显示初始框
    }

    initColumns=()=>{
        this.columns=[
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email',
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                // render:(role_id)=>this.state.roles.find(role => role._id === role_id)
                render:value=>this.roleNames[value]
            },
            {
                title:'操作',
                render:(user)=>(
                    <span>
                       <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                       <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                   </span>
                )
            },
        ]
    }

    //根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
    initRoleNames=(roles)=>{
        const roleNames=roles.reduce((pre,role)=>{//==========?reduce啥意思啊？？？
            pre[role._id]=role.name;
            return pre;
        },{});
        //保存起来
        this.roleNames=roleNames;
    }

    //删除指定用户
    deleteUser=(user)=>{
        Modal.confirm({
            title:`确认删除${user.username}吗？`,
            onOk:async ()=>{
                const result=await reqDeleteUsers(user._id);
                if(result.status===0){
                    message.success('删除用户成功！');
                    this.getUsers();
                }else{
                    message.error('删除用户失败！');
                }
            }
        })
    }

    showAddUser=()=>{
        //显示添加界面
        this.user=null;
        this.setState({
            isShow:true,
        });
    }

    showUpdate=(user)=>{
        //显示修改页面
        this.user=user;
        this.setState({
            isShow:true
        });
    }

    //添加或者更新用户
    addOrUpdateUser= async ()=>{
        //修改或者添加用户
        this.setState({
            isShow:false
        })
        //1.收集数据
        this.form.current.validateFields().then(async value=>{
            const user=value;
            this.form.current.resetFields();
            //如果是更新，就要给user指定_id属性
            if(this.user){
                user._id=this.user._id;
            }
            this.setState({
                isShow:false
            })
            //2.提交请求
            const result=await reqAddOrUpdateUser(user);
            if(result.status===0){
                message.success(`${this.user?'修改':'添加'}用户成功`);
                //3.更新列表显示
                this.getUsers();
            }else{
                message.error(`${this.user?'修改':'添加'}用户失败`);
            }
        })
    };

    getUsers=async ()=>{
        const result=await reqUsers();
        if(result.status===0){
            const {users,roles}=result.data;
            this.initRoleNames(roles);
            this.setState({
                users,
                roles
            })
        }
    };


    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getUsers();
    }

    render(){
        const {users,isShow,roles}=this.state;
        const user=this.user||{};
        const title=<Button type={'primary'} onClick={this.showAddUser}>创建用户</Button>
        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={users}
                        columns={this.columns}
                        pagination={{defaultPageSize:PAGE_SIZE}}
                    />

                    <Modal
                        title={user._id ? '修改用户' : '添加用户'}
                        visible={isShow}
                        onOk={this.addOrUpdateUser}
                        onCancel={() => {
                            this.form.current.resetFields();
                            this.setState({isShow: false});
                        }}
                    >
                        <UsersForm
                            setForm={(form)=>{
                                this.form=form;
                            }}
                            roles={roles}
                            user={user}
                        />
                    </Modal>
                </Card>
            </div>

        )
    }
}



  