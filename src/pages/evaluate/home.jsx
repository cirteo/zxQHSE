import React,{Component} from 'react';
import {
    Card,
    Select,
   Input,
    Button,
    Table,
    message
} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import LinkButton from '../../components/link-button';
import {reqProducts,reqSearchProducts,reqUpdateCategorys,reqUpdateStatus} from '../../api';
import  {PAGE_SIZE} from "../../utils/constants";
import memoryUtils from "../../utils/memoryUtils";

/*
product的默认子路由组件
 */

const { Option } = Select;

export default class ProductHome extends Component{
    state={
        total:0,//商品的总数
        products:[],  //商品的数组
        loading:false,
        searchName:'',//搜索的关键字
        searchType:'productName',//根据那个字段搜索
    }

    //初始化表格列 的函数
    initColumns=()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=>'￥'+price  //当前指定了对应的属性，所以传入的是对应的属性值
            },
            {
                width:100,
                title: '状态',
                //dataIndex: 'status',
                render:(product)=>{
                    const  {status,_id}=product;
                    const newStatus = status===1 ? '2' : 1;
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={()=>this.updateStatus(_id, newStatus)}>
                                {status===1?'下架':'上架'}</Button>
                            <span>{status===1 ? '在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return(
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={()=>this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    showDetail=(product)=>{
        //缓存product对象====》给detail组件使用
        memoryUtils.product=product;
        this.props.history.push('/product/detail');
    }
    showUpdate=(product)=>{
        memoryUtils.product=product;
        this.props.history.push('/product/addupdate');
    }

    //获取指定页面的列表数据显示-------------搜索分页没有
    getProducts=async (pageNum)=>{
        this.pageNum=pageNum; //保存pageNum后面的方法可看见
        const {searchType,searchName}=this.state;
        this.setState({  //显示loading
            loading:true
        })
        //如果搜索关键字有值，说明要进行搜索
        let result;
        if(searchName){
            result=await reqSearchProducts({pageNum, pageSize: PAGE_SIZE,searchName,searchType});
        }else{ //一般分页请求
            result=await reqProducts(pageNum,PAGE_SIZE);
        }

        this.setState({
            loading:false
        })
        if(result.status===0){
            //取出分页数据，更新状态，显示分页列表
            const {total,list}=result.data;
            this.setState({
                total,
                products:list
            })
        }
    }


    //更新指定商品的状态
    // updateStatus=async (productID,status)=>{
    //     // const result=await reqUpdateCategorys(productId,status);
    //     const result=await reqUpdateStatus(productID,status);
    //     if(result.status===0){
    //         message.success('成功啦');  //这里存在一个问题--------------------点击更新状态后不能就在页面上显示改变的状态
    //         console.log(this.pageNum)
    //         this.getProducts(this.pageNum);
    //     }
    // }
    // 更新指定商品的状态
    updateStatus = async (productID, status) => {
        const result = await reqUpdateStatus(productID, status);

        if (result.status === 0) {
            message.success('更新商品成功');
            this.getProducts(this.pageNum);
        }
    };

    componentWillMount(){
        this.initColumns();
    }

    componentDidMount(){
        this.getProducts(1);
    }

 render(){
        const {products,total,loading,searchName,searchType}=this.state;

     const title=(
         <span>
             <Select
                 value={searchType}
                 style={{width:150}}
                 onChange={(value)=>this.setState({searchType:value})}
             >
                 <Option value='productName'>按名称搜索</Option>
                 <Option value='productDesc'>按描述搜索</Option>
             </Select>
             <Input
                 placeholder='关键字'
                 style={{width:150, margin:'0 15px'}}
                 value={searchName}
                 onChange={event=>{
                     this.setState({searchName:event.target.value});
                 }}
             />
             <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
         </span>
     );
     const  extra=(
         <Button type='primary' onClick={()=>{this.props.history.push('/product/addupdate')}}>
             <PlusOutlined/>
                添加商品
         </Button>

     )

         return (
         <Card title={title} extra={extra}>

             <Table
                 rowKey='_id'
                 bordered
                 loading={loading}
                 dataSource={products}
                 columns={this.columns}
                 pagination={{
                     current:this.pageNum,
                     total,
                     defaultPageSize:PAGE_SIZE,
                     showQuickJumper:true,
                     onChange:this.getProducts
                 }}

             />
         </Card>
         )
     }
}