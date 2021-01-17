import React from 'react';
import  {Redirect} from 'react-router-dom';
import './login.less';
import logo from '../../assets/images/logo.png';
import {
    Form,
    Input,
    Button,
Checkbox} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {login} from '../../redux/actions';
import './login.less';

class Login extends React.Component {

//未输入控件input设置布局样式  通过 L
    //提交表单处理函数
    onFinish =async values => {
        if(values){
            //请求登录
            const {username,password}=values;
            //调用分发异步action的函数===》发送登录的异步请求，有了结果只会更新状态
            this.props.login(username,password);
        }else {
            console.log("检验失败》》》");
        }


    }
    render() {
        //判断用户是否登录
        const  user=this.props.user;
        if(user&&user.id){
            return <Redirect to='/home'/>
        }
        const errorMsg=this.props.user.errorMsg;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div className={user.errorMsg ? 'error-msg show':'error-msg'}>{errorMsg}</div>
                    <h2>用户登录</h2>

                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                {
                                    required: true,
                                    whitespace:true,
                                    message: '请输入用户名!'
                                },
                                {
                                    min:4,message:'用户名至少为4位'
                                },
                                {
                                    max:12,message:'用户名至多为12位'
                                },
                                {
                                    pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是由字母、数字、下划线组成'
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                            <a className="login-form-forgot" href="">忘记密码</a>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登  录
                            </Button>
                            <a href="">立即注册</a>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    };
};

export default connect(
    state=>({user:state.user}),
    {login}
)(Login);
