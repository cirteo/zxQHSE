import React,{Component} from 'react';
import {
    Card,
    Button,
    Table,
    message,
     Modal
} from 'antd';
import {UpCircleOutlined } from "@ant-design/icons";
import {reqPublish,reqEvaluate} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import  PublishForm from "./publish-form";
import  PublishedForm  from "./published-form";

export default class Publish extends Component {
    state = {
        loading: false,
        searchName: '',//搜索的关键字
        searchType: 'productName',//根据那个字段搜索
        search: 'evaluateDefault',//查找的类型
        options: [],
        evaluations: [],
        evaluate: {},
        department: [],
        id: [],
        id_single: {},
        selectedRowKeys: [], // Check here to configure the default column
        isShowPublish: false,
        isShow: false,
        role: {}
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef();
    };

    //初始化表格列 的函数
    initColumns = () => {

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
                title: '管理及运行要求',
                dataIndex: 'requirement'
            },
            {
                title: '量化说明',
                dataIndex: 'explains'
            },
            {
                title: '量化项',
                dataIndex: 'term'
            },
            {
                title: '审核方式',
                dataIndex: 'method'
            },
            {
                title: '分数',
                dataIndex: 'score'
            },
            {
                title: '计算公式',
                dataIndex: 'formula'
            },
        ];
    }

    onchange = (e) => {

        const checked = e.target.checked;
        const checkValue = e.target.value;

        let optionIndex;
        if (checked) {
            this.setState(state => ({ //对象语法是函数语法的简洁写法
                options: [...state.options, "11"]
            }));
        } else {
            let options = this.state.options;
            options.forEach(function (val, index,) {
                if (val === checkValue) {
                    optionIndex = index;
                }
            });
            options.splice(options.findIndex(item => item.id === optionIndex), 0);
            this.setState(state => ({ //对象语法是函数语法的简洁写法
                options: options
            }));
        }

    }

    publish = async () => {
        let callbackId = [];
        const evaluateDepartment = this.auth.current.getDepartment();
        const evaluationsName = this.auth.current.state.evaluationsName;
        const autherAccount = memoryUtils.user.account;

        const {selectedRowKeys, id} = this.state;
        const idarray = id;
        for (let i = 0; i < idarray.length; i++) {
            for (let j = 0; j < selectedRowKeys.length; j++) {
                if (idarray[i].key === selectedRowKeys[j]) {
                    callbackId.push(idarray[i]._id);
                }
            }
        }

        let form = {};
        form.auth = autherAccount;
        form.department = evaluateDepartment.toString();
        form.deliveryTerm = callbackId.toString();
        form.deliveryFormName = evaluationsName;
        const result = await reqPublish(form);
        console.log("reqPublish(form);",result)
        if (result.status === 0) {
            message.success("发布量化表成功！");
            this.setState({
                isShowPublish: false,
            })
        } else {
            message.error("发布量化表失败！");
        }

    }


    showDetail = (product) => {
        //缓存product对象====》给detail组件使用
        memoryUtils.product = product;
        this.props.history.push('/product/detail');
    }
    showUpdate = (evaluation) => {
        memoryUtils.evaluation = evaluation;
        this.props.history.push('/evaluate/addupdate');
    }

    //获取指定页面的列表数据显示-------------搜索分页没有
    getEvaluations = async () => {
        this.setState({  //显示loading
            loading: true
        })
        //如果搜索关键字有值，说明要进行搜索
        let result;
        result = await reqEvaluate();
        console.log("t reqEvaluate();",result)
        this.setState({
            loading: false
        })
        this.ids = [];

        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const evaluations = result.data;
            const departments = result.department;
            const depat = [];
            for (let i = 0; i < departments.length; i++) {
                let dep = {};
                dep.title = departments[i];
                dep.key = departments[i];
                depat[i] = dep;
            }
            memoryUtils.departments = depat;

            for (let i = 0; i < evaluations.length; i++) {
                evaluations[i].key = i;
                let id_single = {};
                id_single._id = evaluations[i].id;
                id_single.key = i;

                this.ids[i] = id_single;


            }
            this.setState({
                evaluations,
                id: this.ids,
                department: depat
            })
        }
    }
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };


    componentWillMount() {
        this.getEvaluations();
        this.initColumns();

    }

    componentDidMount() {


    }

    render() {
        const {evaluations, role, isShowPublish, isShow,department, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                {
                    key: 'odd',
                    text: 'Select Odd Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];


                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        });

                        this.setState({selectedRowKeys: newSelectedRowKeys});
                    },
                },
                {
                    key: 'even',
                    text: 'Select Even Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({selectedRowKeys: newSelectedRowKeys});
                    },
                },
            ],

        };
        this.data = [];

        const title = (
            <span>

             <Button type='primary' onClick={() => this.setState({isShow: true})}>查看已发布的量化表</Button>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <Button type='primary' onClick={
                    () => {
                        if (selectedRowKeys.length === 0) {
                            message.warning("请选择发布项！")
                        } else {
                            this.setState({isShowPublish: true})
                        }
                    }

                }>
                <UpCircleOutlined/>
                发布量化表
            </Button>
         </span>
        );
        return (
            <Card title={title}>

                <Table rowSelection={rowSelection} columns={this.columns} dataSource={evaluations}/>
                <Modal
                    title="设置表名和填报对象"
                    visible={isShowPublish}
                    onOk={this.publish}
                    onCancel={
                        () => {
                            this.setState({isShowPublish: false});
                        }
                    }
                >
                    < PublishForm
                        role={role}
                        department={department}
                        ref={this.auth}
                    />

                </Modal>
                <Modal width={800}
                       title="已发布的量化表"
                       visible={isShow}
                       onOk={() => {
                           this.setState({isShow: false});
                       }}
                       onCancel={
                           () => {
                               this.setState({isShow: false});
                           }
                       }
                >
                    < PublishedForm
                        role={role}
                        department={department}
                        ref={this.auth}
                    />

                </Modal>
            </Card>

        )
    }
}
