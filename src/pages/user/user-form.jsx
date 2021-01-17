import React,{Component} from 'react';
import  PropTypes from 'prop-types';
import {Form,Input, Select} from 'antd';
/*
添加分类的form组件
 */
const Item=Form.Item;
const {Option}=Select;
export default class UsersForm extends Component{
    formRef= React.createRef();
    static  propTypes={
        setForm: PropTypes.func.isRequired,     //用来传递form对象
        roles: PropTypes.array.isRequired,       //roles 角色数组
        user: PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render(){
        const {user,roles}=this.props;
        //指定Item布局的配置对象
        const formItemLayout={
            labelCol:{span:4},  //设置左侧label的宽度
            wrapperCol:{span:15},  //左侧包裹的宽度
        }
        return (
            <Form {... formItemLayout} ref={this.formRef} >
                <Item
                label='用户名'
                name='username'
                initialValue={user.username}
                rules={[{required: true, whitespace: true, message: '请输入用户名!'}]}>
                <Input placeholder={'请输入用户名'}/>
            </Item>
                <Item
                    label='账号'
                    name='account'
                    initialValue={user.account}
                    rules={[{required: true, whitespace: true, message: '请输入账号!'}]}>
                    <Input placeholder={'请输入账号'}/>
                </Item>
                <Item
                    label='密码'
                    name='password'
                    initialValue={user.password}
                    rules={[{required: true, whitespace: true, message: '请输入密码!'}]}>
                    <Input type={'password'} placeholder={'请输入密码'}/>
                </Item>

                <Item
                    label='角色'
                    name='type'
                    initialValue={user.type}
                    rules={[
                        {
                            type: "string",
                            required: true,
                            message: '编码项目至少一项',
                            trigger: 'change',
                            transform(value) {
                                var base
                                if(value){
                                    base =""+value
                                }
                                return base
                            }
                        }]}>
                    <Select >
                        {
                            roles.map(role=><Option key={role.id} value={role.name}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}

