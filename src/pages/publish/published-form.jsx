import React,{Component} from 'react';
import {Card,Table} from 'antd';
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import { reqPublishAll,} from "../../api";



export default class PublishedForm extends Component{

    state={
        users:[],//所有用户列表
        roles:[], //所有角色的列表
        isShow:false, ///标识是否显示初始框
        form:[]
    }

    showAll=async ()=>{
        this.setState({isShow:true})
        const result=await reqPublishAll();
        if(result.status===0){
            const form =result.data;
            this.setState({
                form
            })
        }
    }


    initColumns=()=>{
        this.columns=[//----------------------------------------------------
            {
                title:'量化表ID',
                dataIndex:'id'
            },
            {
                title:'量化表',
                dataIndex:'deliveryFormName'
            },
            {
                title:'发布者',
                dataIndex:'auth',
            },
            {
                title:'发布时间',
                dataIndex:'auth_time',

            },
            {
                title:'操作',
                render:()=>(

                    <span>
                       <LinkButton >修改</LinkButton>
                       <LinkButton onClick={this.deleteForm}>删除</LinkButton>
                   </span>
                )
            },
        ]
    }


    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){

        this.showAll();
    }

    render(){
        const {form}=this.state;
        return (
            <div>
                <Card>
                    <Table
                        rowKey='id'
                        dataSource={form}
                        columns={this.columns}
                        pagination={{defaultPageSize:PAGE_SIZE}}
                    />
                </Card>
            </div>
        )
    }
}







