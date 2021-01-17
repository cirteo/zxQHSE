import React from "react";
import PropTypes from 'prop-types';
import { Upload, Modal ,message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import  {reqDeleteImg} from '../../api';
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
//图片上传组
export  default class PicturesWall extends React.Component {
    static  propTypes={
        imgs:PropTypes.array
    }

    state = {
        previewVisible: false, //标识是否显示大图预览Modal
        previewImage: '',//大图url
        previewTitle:'',
        fileList: [

        ],
    };

    //这样可以获取到图片----------------------------------问题：暂时不能显示，404，通过postman上传的图片有问题
    constructor(props){
        super(props);
        let  fileList=[];
        //如果传入了imgs属性
        const {imgs}=this.props;
        if(imgs && imgs.length>0){
            fileList=imgs.map((img,index)=>({
                uid:-index,
                name:img,
                status:'done',  //图片状态
                url:BASE_IMG_URL+img
            }))
        }
        //初始化状态
        this.state={
            previewVisible:false, //是否显示大图预览：
            previewImage:'',
            previewTitle: '',
            fileList  //所有已上传图片的地址
        }
    }

    //用来获取已上传图片文件名的数组
    getIMgs=()=>{
        return this.state.fileList.map(file=>(file.name));
    }

    //隐藏modall
    handleCancel = () => this.setState({ previewVisible: false });

    //显示指定file指定的大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //filelist:所以已上传图片的对象的数组
    //file：当前操作的图片文件（上传|删除）
    handleChange = async ({ file,fileList }) => {

        //一旦上传成功，将当前上传的file的信息（name,url)进行修正
        if(file.status=='done'){

            const result=file.response;//{status；0，data{name：'xxx.jpg',url:'图片地址'}
            if(result.status===0){
                message.success('上传图片成功！');
                const {name,url}=result.data;
                file=fileList[fileList.length-1];
                file.name=name;
                file.url=url;

            }else{
                message.error('上传图片失败！');
            }
        }else if(file.status==='removed'){//删除上传的图片
            const result=await reqDeleteImg(file.name);
            if(result.status===0){
                message.success('删除图片成功！');
            }else {
                message.error('删除图片失败！');
            }

        }

        //在操作过程中（上传|删除）及时的更新fileList的状态
        this.setState({ fileList })
    };



    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload" //上传图片的地址
                    accept='image/*' //指定文件上传的格式   指定只接受图片的格式
                    listType="picture-card" //图片上传的样式
                    name='image' //请求参数名
                    fileList={fileList} //指定所有已上传文件的列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {/*限制图片上传的个数*/}
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
