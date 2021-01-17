import React,{Component, useState, useEffect} from 'react';
import  {Redirect,useHistory} from 'react-router-dom';
import './login.less';
import logo from '../../assets/images/logo.png';
import {
    Form,
    Input,
    Button,
    message,
Checkbox} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import {reqLogin} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import {connect} from 'react-redux';
import {login} from '../../redux/actions';
import './login.less';
import storageUtils from "../../utils/storageUtils";
//默认暴露的时候就不用{}
/*
 登录的路由组件
*/
/*
* useState: 和class的state一样的状态管理 返回一个数组
* useEffect 相当于状态组件中的componentDidMount+componentDidUpdate+componentWillUnmount三个钩子函数的结合体
* */

//在代码中用到了antd的组件<NormalLoginForm/> andt 4.0以上版本中用： React.Component

class Login extends React.Component {
    // handleSubmit = (event) => {
    //     //阻止事件的默认行为
    //     event.preventDefault();
    //
    //     //对所有表单字段进行验证
    //     this.props.form.validateFields((err,values)=>{
    //         if(!err){
    //             console.log('提交登录的ajax请求',values);
    //     }
    //     })
    //
    // }
//未输入控件input设置布局样式  通过 L

//form表单的引入
   /*  NormalLoginForm = () => {

        let history=useHistory();
        /*提交表单且数据验证成功后回调的事件
        const onFinish = values => {
            console.log('Received values of form: ', values);
        };

        //字段值更新时触发的回调事件
        const onValuesChange=()=>{

        }


    };*/
    //提交表单处理函数
    onFinish =async values => {

        //console.log('Received values of form: ', values);
        if(values){
            //请求登录
            const {username,password}=values;
            //调用分发异步action的函数===》发送登录的异步请求，有了结果只会更新状态
            this.props.login(username,password);

            /* try{
                 const response=await reqLogin(username,password);//------------------------------------------------
                 if(response.status===0){
                     //登录成功
                     console.log("成功00000000了");
                     message.success("登录成功");
                     //保存user
                     const user=response.data;
                     memoryUtils.user=user;//保存在内存中
                     storageUtils.saveUser(user);//保存到local中
                     //跳转到后台的管理界面 (不需要再回退到登录界面) 页面跳转的时候出现错误，找不到props
                       //this.props.history.replace('/home');
                     //这个地方的跳转失败~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     history.push('/home');

                 }else{
                     //登录失败
                     message.err(response);
                 }
             }catch (e) {
                 console.log("失败了~",e);
                 alert("登录失败，请输入正确的用户名或密码！");
             }*/
        }else {
            console.log("检验失败》》》");
        }


    }
    render() {
        //判断用户是否登录
        //如果用户已经登录，就自动跳转到管理界面
        // const  user=memoryUtils.user;
        console.log("这是打印 this",this);
        const  user=this.props.user;//000000000000000000000000000000000000000000000000000000
        if(user &&user._id){
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
                                //自定义的验证函数
                                {

                                }
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




// export default withRouter(Login);
export default connect(
    state=>({user:state.user}),
    {login}
)(Login);

/*
包装From组件

然后就可以获取到form对象
const  form=this.props.form;  //from对象具有获取数据和表单验证的功能


高阶函数
 常见：
   1. 定时器 setTimeout()   setInterval()
   2. Promise : Promise(()=>{}) then(value=>{},reason=>{})
   3.数组遍历的相关方法： forEach()  /filter()  /map()  / reduce()  /find() / findIndex()
   4. Form.create()();

 特点：
    1. 接受函数类型的函数
    2.返回值是函数

  高阶函数更新动态，更具有扩展性

高阶组件
  1.本质是以函数
  2.接受一个组件（被包装的组件），返回一个新的组件（包装组件），新组建内部渲染被包装，也就是
  包装组件会向被包装组件传入特定属性
  3.作用：扩展组价的功能
  4.高阶组件也是一个高阶函数

async  在返回promise的左侧
await
简化了promise对象的使用： 不用再使用then()来指定成功/失败的回调函数
 */
