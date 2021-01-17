import React,{Component} from 'react';
import  PropTypes from 'prop-types';
import {
    Form,
    Input,
} from 'antd';
/*
添加分类的form组件
 */
const Item=Form.Item;
export default class AddForm extends Component{
    form= React.createRef();

    static  propTypes={
        setForm:PropTypes.func.isRequired,  //用于传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.form)
    }
    render(){
        //指定Item布局的配置对象
        const formItemLayout={
            labelCol:{span:4},  //设置左侧label的宽度
            wrapperCol:{span:15},  //左侧包裹的宽度
        }
        return (
            <Form
                name='add'
                ref={this.form}
            >
                <Item
                    {... formItemLayout}
                    label='角色名称：'
                    name='roleName'
                    rules={[{required: true, whitespace: true, message: '角色名称必须输入!'}]}
                >
                    <Input placeholder={'请输入角色名称'}/>
                </Item>
            </Form>
        )
    }
}

