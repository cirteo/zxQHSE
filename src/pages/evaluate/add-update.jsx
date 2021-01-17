import React,{Component} from 'react';

import {
    Card,
    Form,
    Input,
    Cascader, //级联列表
    Upload,  //上传
    Button,
    message
} from 'antd';
import PicturesWall from './pictures-wall';
import  LinkButton from '../../components/link-button';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategorys,reqAddOrUpdateProduct} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import RichTextEditor  from  './rich-text-editor';

/*
product的产品添加和修改更新子路由
1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法

使用ref：
    1.创建ref容器：this,pw=React.createRef();
    2.将ref容器交给需要获取的标签元素<PicturesWall ref={this.pw/>
    3.通过ref容器读取标签元素：this,pw.current

 */

const {Item}=Form;
const { TextArea } = Input;


export default class ProductAddUpdate extends Component{
    forRef=React.createRef();

    state={
        options:[]
    };

    constructor(props){
        super();
        //创建用来保存ref标识的标签对象容器
        this.pw=React.createRef();
        this.editor=React.createRef();

    }

    //异步获取一级|二级分类列表并显示
    getCategorys = async (parentId)=>{
        //async  函数返回的是一个promise对象 promise对象的结果和值是由async的结果来决定的
      //获取一级或者二级列表
       const result=await reqCategorys(parentId); //{status:0,data:categrys}
        if(result.status===0){
           const categorys=result.data;

           if(parentId==='0'){
               //如果是一级列表
               this.initOptions(categorys);
           }else{
               //也就是二级列表
               return categorys;//返回二级列表
           }
       }
    };

    initOptions =async (categorys)=>{
        //根据categorys数组生成options数组
    const options=categorys.map(c=>({
        value: c._id,  //
        label: c.name,
        isLeaf: false, //不是叶子
    }));

    //如果是一个二级分类的商品更新
        const {isUpdate,product}=this;
        const {pCategoryId,categoryId}=product;
        if(isUpdate && pCategoryId!=='0'){
            //获取响应的二级分类列表
            const subCategorys=await this.getCategorys(pCategoryId);
            //生成二级下拉列表的options
            const cOptions=subCategorys.map((c)=>({
                value: c._id,  //
                label: c.name,
                isLeaf: true, //不是叶子
            }));

            //找到当前商品对应的一级options选项
            const targetOption = options.find(option => option.value === pCategoryId);
            // 关联对应的一级option上------报错 children  undefined
            targetOption.children = cOptions;
        }
        //最后要更新options的状态
        this.setState({
            // options:[...options]
            options,
        })

    };

    //用来加载下一级列表的回调函数
    loadData=async selectedOptions=>{
        // 得到的option
        const targetOption = selectedOptions[selectedOptions.length - 1];

        // 显示loading效果
        targetOption.loading = true;

        // 根据选中的分类，异步获取二级列表 await得到的是promise的返回的值
        const subCategorys = await this.getCategorys(targetOption.value);

        // 隐藏loading效果
        targetOption.loading = false;


        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const cOptions = subCategorys.map((c) => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            // 关联到当前的option上
            targetOption.children = cOptions
        } else {//当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
    };

    //表单验证
    submit=()=>{
        //进行表单验证，如果通过，才发送请求
        this.forRef.current.validateFields().then(async value=>{
            //1.收集数据 并封装为promise对象
            const {name,desc,price,categoryIds}=value;
            let pCategoryId,categoryId;
            if(categoryIds.length===1){
                pCategoryId='0';
                categoryId=categoryIds[0];
            }else{
                pCategoryId=categoryIds[0];
                categoryId=categoryIds[1];
            }

            const imgs=this.pw.current.getIMgs();
            const detail=this.editor.current.getDetail();

            //封装成product
            const product={name,desc,price,imgs,detail,pCategoryId,categoryId};

            //如果是更新，就需要添加_id;
            if(this.isUpdate){
                product._id=this.product._id;
            }

            //2.调用接口请求函数去添加、更新
            const result=await reqAddOrUpdateProduct(product);
            //3.根据结果提示
            if(result.status===0){
                message.success(`${this.isUpdate? '更新':'添加'}商品成功！`);
                this.props.history.goBack();//返回上一个页面
            }else{
                message.error(`${this.isUpdate? '更新':'添加'}商品失败！`)
            }

        })
        //     .catch(err=>{
        //     alert('失败了！');
        // })

    };

    //验证价格的自定义函数
    validatorPrice=(rule,value,callback)=>{
        if(value * 1 > 0){
            callback();//验证通过
        }else{
            callback("输入的价格必须大于0");//验证未通过
        }
     }

    componentDidMount(){
        this.getCategorys('0');
    }

    componentWillMount(){
        //取出携带的sate
        //读取携带过来的state数据
        const product=memoryUtils.product;//如果是添加，就没有值；否则就有值
        //保存是否是更新的标志
        this.isUpdate=!!product._id;//强制转换为布尔值
        //保存商品（没有就是空）
        this.product=product||{};
    }

    componentWillUnmount(){
        //卸载之前清除保存数据
        memoryUtils.product={};
    }


    render(){
        const {isUpdate,product}=this;
        const {pCategoryId,categoryId,imgs,detail}=product;
        //接收级联分类ID的数组

        const categoryIds=[];

        if(isUpdate){
            if(pCategoryId==='0'){
                //r如果商品是一个一级分类
                categoryIds.push(categoryId);
            }else{
                //如果商品是一个二级分类产品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }

        const title=(
            <span>
                <LinkButton >
                    <ArrowLeftOutlined
                        style={{color:'green',marginRight:15,fontSize:20}}
                        onClick={()=>this.props.history.goBack()}
                    />
                    <span>{isUpdate ? '修改商品' : '添加商品'}</span>
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
                    <Item label='商品名称'
                          initialValue={product.name}
                        name={'name'}  //声明验证
                        rules={[
                            {
                                required:true,
                                whitespace:true,
                                message:'请输入商品名称！'
                            }
                        ]}
                    >
                        <Input placeholder='请输入商品名称'/>
                    </Item>
                    <Item label='商品描述'
                          initialValue={product.desc}
                          name={'desc'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入商品描述！'
                              }
                          ]}>
                        <TextArea
                            placeholder="请输入商品描述"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>
                    <Item label='商品价格'
                          initialValue={product.price}
                          name={'price'}
                          rules={[
                              {
                                  required:true,
                                  whitespace:true,
                                  message:'请输入商品价格！'
                              },{validator:this.validatorPrice}
                          ]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
                    </Item>
                    <Item label='商品分类'
                           // initialValue={product.categoryId}
                          name={'categoryIds'}
                          rules={[
                              {
                                  required:true,
                                  message:'请输入商品分类！'
                              },
                          ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            placeholder={'请选择商品分类'}
                        />

                    </Item>
                    <Item label='商品图片'
                    >
                       <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情'
                          labelCol={{span:2}}  //左侧label的宽度
                          wrapperCol={{span:20}} //指定右侧包裹的宽度
                    >
                       < RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item >
                        <Button type='primary'  htmlType="submit" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }

}


// ReactDOM.render(<LazyOptions />, mountNode);
// Form.create()(ProductAddUpdate);

/*
1.ProductAddUpdate
    1）基本页面
    Card  /Form /Input | TextArea |Button
    FormItem 的label标题和layout
    2）分类的连级列表
    Cascader 的基本使用
    异步获取一级分类列表，生成一级分类options
    如果当前是更新二级分类的商品，异步获取对应的二级分类列表，生成二级分类的options，并添加到对应的option的children下
    async函数返回的是一个promise对象，promise的结果和值由async函数 的结果决定
    当选择某个一级分类项时，异步获取对应的二级分类列表，生成二级分类options，并添加为当前option的children

    3）表单数据收集和表单验证




    2.PictureWall
    1）antd组件
        Upload |Modal |Icon
        根据示例Demo改编
    2）上传图片
    在<Upload>上配置接口的path和请求参数名
    监视文件状态的改变：上传中|上传完成|删除
    在上传成功时，保存好相关的信息:name |url
    为父组件提供获取已上传图片的文件名数组的方法
    3）删除图片
    当文件状态变为删除时，调用删除图片的接口删除上传到后台的图片
    4）父组件调用子组件对象的方法：使用ref技术
    1.创建ref容器：this.pw=React.createref()
    2.将ref容器交给需要获取的标签元素：<PictureWall ref={this.pw} />
    3.通过ref容器读取标签元素:this.pw.current


    标签对象就是组件对象

 */
