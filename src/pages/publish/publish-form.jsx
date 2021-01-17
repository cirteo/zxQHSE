import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Tree,Input,Form} from 'antd';
const Item =Form.Item;
export default class PublishForm extends Component{
    static propTypes={
        role:PropTypes.object,
        department:PropTypes.array
    }



    constructor(props){
            super(props);

            this.state={
                checkedKeys:'',
                evaluationsName:''
            }
    }

     onCheck = checkedKeys=> {
       this.setState({checkedKeys},() => {
           console.log('加载完成')

       })

    };

    //为父组件提供最新的menus
    getDepartment=()=>this.state.checkedKeys;
    render(){
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15},
        }
        const departments=this.props.department;
        return (
            <div>
                <Item {...formItemLayout} label={'量化表名称'}>
                    <Input
                        onChange={event=>{
                            this.setState({evaluationsName:event.target.value});
                        }}/>
                </Item>
                <p>填报对象：</p>
                <Tree
                    checkable
                    defaultExpantAll={true}
                    treeData={departments}
                    checkedKeys={this.state.checkedKeys}
                    onCheck={this.onCheck}>
                </Tree>
            </div>
        )
    }
}

