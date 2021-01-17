import React,{Component} from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Table} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import LinkButton from '../../components/link-button';
import {reqEvaluate,reqEvaluateTheme} from '../../api';
import  {PAGE_SIZE} from "../../utils/constants";
import memoryUtils from "../../utils/memoryUtils";

/*
product的默认子路由组件
 */

const { Option } = Select;

export default class EvaluateHome extends Component{
    state={
        total:0,//商品的总数
        products:[],  //evaluation的数组
        loading:false,
        searchName:'',//搜索的关键字
        searchType:'productName',//根据那个字段搜索
        search:'evaluateDefault',//查找的类型
    }

    //初始化表格列 的函数
    initColumns=()=>{
        this.columns = [
            {
                title: '主题',
                dataIndex: 'theme'
            },
            {
                title: '项目',
                dataIndex: 'project'
            },
            {
                title: '内容',
                dataIndex: 'content'
            },
            {
                title:'管理及运行要求',
                dataIndex:'requirement'
            },
            {
                title:'量化说明',
                dataIndex:'explains'
            },
            {
                title:'量化项',
                dataIndex:'term'
            },{
                title:'审核方式',
                dataIndex:'method'
            } ,{
                title:'分数',
                dataIndex:'score'
            },
            {
                title:'计算公式',
                dataIndex:'formula'
            },
            {
                title: '量化项目',
                dataIndex: 'term'
            },

            {
                width:100,
                title: '操作',
                render:(evaluation)=>{
                    return(
                        <span>

                            <LinkButton onClick={()=>this.showUpdate(evaluation)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }


    showUpdate=(evaluation)=>{
        memoryUtils.evaluation=evaluation;
        this.props.history.push('/evaluate/addupdate');
    }

    //获取指定页面的列表数据显示-------------搜索分页没有
    getEvaluations=async ()=>{
        const {search,searchName}=this.state;

        this.setState({  //显示loading
            loading:true
        })
        //如果搜索关键字有值，说明要进行搜索
        let result;
        console.log("search",search);
        if(search!=="evaluateDefault"){
            console.log("给的参数",searchName)
            result=await reqEvaluateTheme(search,searchName);
            console.log("reqEvaluateThem",result);
        }else {
            result=await reqEvaluate();
            console.log("reqEvaluate()",result);
        }

        console.log("返回 ",result)

        this.setState({
            loading:false
        })
        if(result.status===0){
            //取出分页数据，更新状态，显示分页列表
            const data=result.data;
            this.setState({

                evaluations:data
            })
        }
    }


    componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){
        this.getEvaluations();
    }

 render(){
        const {evaluations,total,loading,searchName,search}=this.state;
        console.log("se",search);

     const title=(
         <span>
             <Select
                 value={search}
                 style={{width:150}}
                 onChange={(value)=>this.setState({search:value})}
             >
                 <Option value='evaluateDefault' >默认搜索</Option>
                 <Option value='theme' >按主题搜索</Option>
                 <Option value='project'>按项目搜索</Option>
                 <Option value='content'>按内容搜索</Option>
             </Select>
             <Input
                 disabled={search==='evaluateDefault'?true:false}
                 placeholder='关键字'
                 style={{width:150, margin:'0 15px'}}
                 value={searchName}
                 onChange={event=>{
                     this.setState({searchName:event.target.value});
                 }}
             />
             <Button type='primary' onClick={()=>{this.getEvaluations()}}>搜索</Button>
         </span>
     );
     const  extra=(
         <Button type='primary' onClick={()=>{this.props.history.push('/evaluate/addupdate')}}>
             <PlusOutlined/>
                添加量化项
         </Button>

     )

         return (
         <Card title={title} extra={extra}>

             <Table
                 rowKey='id'
                 bordered
                 loading={loading}
                 dataSource={evaluations}
                 columns={this.columns}
                 pagination={{
                     current:this.pageNum,
                     total,
                     defaultPageSize:PAGE_SIZE,
                     showQuickJumper:true,
                     onChange:this.getEvaluations
                 }}

             />
         </Card>
         )
     }
}
