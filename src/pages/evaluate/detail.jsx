import React,{Component} from 'react';
import {
    Card,
    List,

} from 'antd';
import './product.less'

import {ArrowLeftOutlined} from "@ant-design/icons";
import  LinkButton from '../../components/link-button';
import {BASE_IMG_URL} from '../../utils/constants';
import {reqCategory} from '../../api';
import memoryUtils from "../../utils/memoryUtils";

/*
product的产品详情子路由
 */
export default class ProductDetail extends Component{

    state={
        cName1:'',  //二级分类名称
        cName2:'',  //二级分类名称
    }

  /* async componentDidMount(){
        //得到当前商品的分类ID
        const {pCategoryId,categoryId}=memoryUtils.product;
        if(pCategoryId===0){  //一级分类下的商品
           const result=await reqCategory(categoryId);
           const cName1=result.data.name;
           this.setState({cName1})
        }else {  //二级分类下的商品

            //通过多个await请求：后面的一个请求是在前一个请求成功之后才发送
            // const result1=await reqCategory(pCategoryId);
            // const result2=await reqCategory(categoryId);
            // const cName1=result1.data.name;
            // const cName2=result2.data.name;

            // 一次发送多个请求，只有都成功了才正常处理
            const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
            const cName1=results[0].data.name;
            const cName2=results[1].data.name;


            this.setState({
                cName1,cName2
            })
        }
    }*/
    async componentDidMount() {
        const {pCategoryId, categoryId} = memoryUtils.product;
        if (pCategoryId === '0') { //一级分类下的商品
            const result = await reqCategory(categoryId);
            const cName1 = result.data.name;
            this.setState({cName1})
        } else {   //二级分类下的商品

            // // 一次性发送多个请求，只有都成功了，才正常处理，问题不大，效率偏低
            // const result1 = await reqCategory(pCategoryId).data;  //获取一级分类列表
            // const result2 = await reqCategory(categoryId).data;  // 获取二级分类列表
            // const cName1 = result1.data.name;
            // const cName2 = result2.data.name;

            // 一次性发送多个请求，只有都成功了，才正常处理
            const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
            const cName1=results[0].data.name;
            const cName2=results[1].data.name;

            this.setState({
                cName1,
                cName2
            })
        }
    }
    componentWillUnmount() {
        // 卸载之前清除保存数据
        memoryUtils.product={}
    }

    render(){
        //读取携带过来的state数据
        const {name,desc,price,detail,imgs}=memoryUtils.product;
        const {cName1,cName2}=this.state;

        const title=(
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{color:'green',marginRight:15,fontSize:20}}
                        onClick={()=>this.props.history.goBack()}

                    />
                </LinkButton>
                商品详情
            </span>
        )
        return (
            <Card title={title} className="product-detail">
             <List
                 bordered
             >
                 <List.Item>
                     <span className="left">商品名称：</span>
                     {name}
                 </List.Item>
                 <List.Item>
                     <span className="left">商品描述：</span>
                     {desc}
                 </List.Item>
                 <List.Item>
                     <span className="left">商品价格：</span>
                     {price}元
                 </List.Item>
                 <List.Item>
                     <span className="left">所属分类：</span>
                     {cName1} {cName2? '-->'+cName2:''}
                 </List.Item>
                 <List.Item
                     >
                     <span className="left">商品图片：
                         {
                             imgs.map((img) => (
                                 <img
                                     key={img}
                                     src={BASE_IMG_URL + img}
                                     className='product-img'
                                     alt="img"/>
                             ))
                         }
                     </span>
                 </List.Item>
                 <List.Item>
                     <span className="left">商品详情：
                         <span  className="left-l" dangerouslySetInnerHTML={{__html:detail}}></span>
                         </span>
                 </List.Item>
             </List>
            </Card>
        )
    }
}