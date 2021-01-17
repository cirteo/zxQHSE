import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    static propTypes={
        detail:PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
    }

    constructor(props) {
        super(props);
        const html =this.props.detail;
        if(html){ //HTML有值：根据HTML格式创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html); //生成一个内部块
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        }else {
            this.state={
                editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
            }
        }

    }


    //输入过程中实时的回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    //返回输入数据对应的HTML格式的文本
    getDetail=()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
     uploadImageCallBack=(file)=>{
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');//上传图片的接口
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);//response 返回的数据
                    const url=response.data.url;//得到图片地址url
                    resolve({data:{link:url}});

                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{border:'1px solid black',minheight:40,paddingLeft:10}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/*<textarea*/}
                    {/*disabled*/}
                    {/*value={}*/}
                {/*/>*/}
            </div>
        );
    }
}
