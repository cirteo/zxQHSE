import React,{Component} from 'react';

import {
    Card,
    Form,
    Input,
    Cascader, //级联列表
    Upload,  //上传
    Button,
    message,
    Select
} from 'antd';
import PicturesWall from './pictures-wall';
import  LinkButton from '../../components/link-button';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategorys,reqAddOrUpdateEvaluate} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import RichTextEditor  from  './rich-text-editor';


const {Item}=Form;
const { TextArea } = Input;


const { Option } = Select;

export default class EvaluateAddUpdate extends Component{
    forRef=React.createRef();
    state={

    };

    constructor(props){
        super();
        //创建用来保存ref标识的标签对象容器
        this.pw=React.createRef();
        this.editor=React.createRef();
    }


    handleChange=(value)=> {
        console.log(`selected ${value}`);
    }
    //表单验证
    submit=()=>{
        //进行表单验证，如果通过，才发送请求
        this.forRef.current.validateFields().then(async value=>{
            //1.收集数据 并封装为promise对象
            const {theme,project,content,requirement,explains,term,method,score,formula,haveScore,description}=value;


            //封装成product
            const evaluation={theme,project,content,requirement,explains,term,method,score,formula,haveScore,description};

            //如果是更新，就需要添加_id;
            if(this.isUpdate){
                console.log("选择的id",this.evaluation.id);
                evaluation.haveScore='';
                evaluation.description='';
                evaluation.id=this.evaluation.id;
            }
            console.log("zhegs hi ds",evaluation);
            //2.调用接口请求函数去添加、更新
            const result=await reqAddOrUpdateEvaluate(evaluation);
            //3.根据结果提示
            if(result.status===0){
                message.success(`${this.isUpdate? '更新':'添加'}量化项成功！`);
                this.props.history.goBack();//返回上一个页面
            }else{
                message.error(`${this.isUpdate? '更新':'添加'}量化项失败！`)
            }

        })

    };

    componentDidMount() {
    }

    componentWillMount(){
        //取出携带的sate
        //读取携带过来的state数据
        const evaluation=memoryUtils.evaluation;//如果是添加，就没有值；否则就有值
        //保存是否是更新的标志
        this.isUpdate=!!evaluation.id;//强制转换为布尔值
        //保存商品（没有就是空）
        this.evaluation=evaluation||{};
    }

    componentWillUnmount(){
        //卸载之前清除保存数据
        memoryUtils.evaluation={};
    }


    render(){
        const {isUpdate,evaluation}=this;
        const {theme,project,content,requirement,explains,term,method,score,formula,haveScore,description}=evaluation;
        //接收级联分类ID的数组
        const title=(
            <span>
                <LinkButton >
                    <ArrowLeftOutlined
                        style={{color:'#297FB8',marginRight:15,fontSize:20}}
                        onClick={()=>this.props.history.goBack()}
                    />
                    <span>{isUpdate ? '修改量化项' : '添加量化项'}</span>
                </LinkButton>
            </span>
        )

        //指定item布局的配置对象
        const formItemLayout={
            labelCol:{span:1.5},  //左侧label的宽度
            wrapperCol:{span:8}, //指定右侧包裹的宽度
        }

        return (
            <Card title={title}>
                <Form
                    {...formItemLayout} ref={this.forRef} >
                    <Item label='主题'
                          initialValue={evaluation.theme}
                        name={'theme'}  //声明验证
                        rules={[
                            {
                                required:true,
                                whitespace:true,
                                message:'请输入主题！'
                            }
                        ]}
                    >
                        <Input placeholder='请输入主题'/>
                    </Item>
                    <Item label='项目'
                          initialValue={evaluation.project}
                          name={'project'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入项目！'
                              }
                          ]}>
                        <Input placeholder='请输入项目'/>
                    </Item>
                    <Item label='内容'
                          initialValue={evaluation.content}
                          name={'content'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入内容！'
                              }
                          ]}>
                        <TextArea
                            placeholder="请输入内容"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>
                    <Item label='管理及运行要求'
                          initialValue={evaluation.requirement}
                          name={'requirement'}  //声明验证
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入管理及运行要求！'
                              }
                          ]}
                    >
                        <TextArea
                            placeholder="请输入管理及运行要求！"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>
                    <Item label='量化说明'
                          initialValue={evaluation.explains}
                          name={'explains'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入量化说明！'
                              }
                          ]}>
                       < TextArea
                        placeholder="请输入量化说明！"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>

                    <Item label='量化项'
                          initialValue={evaluation.term}
                          name={'term'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入量化项！'
                              }
                          ]}>
                        <Input placeholder='请输入量化项'/>
                    </Item>

                    <Item label='审核方式'
                          initialValue={evaluation.method}
                          name={'method'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入审核方式！'
                              }
                          ]}>
                        <Input placeholder='请输入审核方式'/>
                        {/*<Select*/}
                            {/*mode="multiple"*/}
                            {/*allowClear*/}
                            {/*style={{ width: '100%' }}*/}
                            {/*placeholder="请选择审核方式"*/}
                            {/*defaultValue={['查询资料']}*/}
                            {/*onChange={this.handleChange}*/}
                        {/*>*/}
                            {/*<Option key={"source"}>查询资料</Option>*/}
                            {/*<Option key={"interview"}>访谈</Option>*/}
                        {/*</Select>*/}
                    </Item>

                    <Item label='分数'
                          initialValue={evaluation.score}
                          name={'score'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入分数！'
                              }
                          ]}>
                        <Input placeholder='请输入分数'/>
                    </Item>

                    <Item label='计算公式'
                          initialValue={evaluation.formula}
                          name={'formula'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入计算公式！'
                              }
                          ]}>
                        <Input placeholder='请输入计算公式'/>
                    </Item>

                    {/*<Item label='得分'*/}
                          {/*initialValue={evaluation.haveScore}*/}
                          {/*name={'haveScore'}*/}
                          {/*rules={[*/}
                              {/*{*/}
                                  {/*required:true,*/}
                                  {/*whitespace:true,*/}
                                  {/*message:'请输入得分！'*/}
                              {/*}*/}
                          {/*]}>*/}
                        {/*<Input placeholder='请输入得分'/>*/}
                    {/*</Item>*/}

                    {/*<Item label='可能存在的问题描述'*/}
                          {/*initialValue={evaluation.description}*/}
                          {/*name={'description'}*/}
                          {/*rules={[*/}
                              {/*{*/}
                                  {/*required:true,*/}
                                  {/*whitespace:true,*/}
                                  {/*message:'请输入可能存在的问题描述！'*/}
                              {/*}*/}
                          {/*]}>*/}
                        {/*<Input placeholder='请输入可能存在的问题描述'/>*/}
                    {/*</Item>*/}





                    <Item >
                        <Button type='primary'  htmlType="submit" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }

}





