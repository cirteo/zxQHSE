import React,{Component} from 'react';
import {
    Card,
    Form,
    Button,
    message,
    List
} from 'antd';
import  LinkButton from '../../components/link-button';
import {DownCircleOutlined } from "@ant-design/icons";
import {reqDlivery,reqContentList} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import RichTextEditor  from  './rich-text-editor';


const {Item}=Form;

export default class EvaluateAddUpdate extends Component{
    forRef=React.createRef();
    state={
        data:[],
        form_id:"",
        auth:"",
        form:{},
        formName:''
    };

    constructor(props){
        super();
        //创建用来保存ref标识的标签对象容器
        this.pw=React.createRef();
        this.editor=React.createRef();
    }

    contentList=async ()=> {
        const account = memoryUtils.user.account;
        const result = await reqContentList(account);
        console.log("reqContentList",result)
        let dataContent = [];
        if (result.status === 0) {
            for (let i = 0; i < result.data.length; i++) {
                dataContent[i] = result.data[i].term;
            }
            const form = result.data2[0]

            const auth = result.data2.auth;
            const formName = result.data2.deliveryFormName;
            console.log("返回过来的------------------form", form)
            console.log("返回过来的formNAme", formName)
            this.setState({
                data: dataContent,

                form,
                auth,
                formName
            })

        }
    }

    submit=async ()=>{
        //进行表单验证，如果通过，才发送请求
        const getDetail=this.editor.current.getDetail();
        const {form}=this.state;
       const detail=getDetail.replace(/<\/?.+?>/g,"");

        let formdata={};
        formdata.deliveryID=form.id;
        formdata.account=memoryUtils.user.account;
        formdata.detail=detail;
        const result=await reqDlivery(formdata);
        console.log(" reqDlivery(formdata);",result)
        if(result.status===0){
            message.success("提交成功！")
        }else{
            message.error("提交失败！")
        }

    };



    componentWillMount(){

        //读取携带过来的state数据
        const evaluation=memoryUtils.evaluation;//如果是添加，就没有值；否则就有值
        //保存是否是更新的标志
        this.isUpdate=!!evaluation.id;//强制转换为布尔值
        //保存商品（没有就是空）
        this.evaluation=evaluation||{};
        this.contentList();

    }



    render(){
        const {data,form}=this.state;
        const formName=form.deliveryFormName;

        //接收级联分类ID的数组
        const title=(
            <span>
                <LinkButton >
                    <DownCircleOutlined
                        style={{color:'#297FB8',marginRight:15,fontSize:20}}
                    />
                    <span>{formName}</span>
                </LinkButton>
            </span>
        )


        return (
            <Card title={title} width={800}>
                <Form
                    ref={this.forRef} >

                    <Item>
                        <Card title="量化考评细节" bordered={false} >
                            <List
                                // header={<div>Header</div>}

                                bordered
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Item>
                    <Item>
                        请上传相关量化考核材料：
                    </Item>
                    <Item>
                        < RichTextEditor ref={this.editor} />
                    </Item>


                    <Item >
                        <Button type='primary'  htmlType="submit" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }

}






