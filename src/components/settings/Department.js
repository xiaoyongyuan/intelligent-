import React, { Component} from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Form,Input, Row, Col, Button , Modal, Table, message } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;

class Department extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[]
        };
    }

    componentDidMount() {
        this.requestdata()
    }
    requestdata = (params) => {//取数据
        axios.get("table.json",params)
        . then((res)=>{
            if(res.data.success){
                console.log(res.data.data);
                this.setState({
                    list: res.data.data
                })
            }
        })
    }
    showModal = () => { //新增弹窗
        this.setState({
            visible: true,
            type:0
        });
        
    };
    handleChange = (e) => { //新增提交
        this.setState({
            departname:e.target.value
        });
    }
    handleCreate = (e) => {//modal提交
        e.preventDefault();
        if(this.state.departname){
            if(this.state.code){
                console.log('编辑成功',this.state.departname)
            }else{
                console.log('新增成功',this.state.departname)
            }
            
            this.setState({
                visible: false,
                departname:''
            });
        }else{
           message.warn('请输入名称'); 
        }
        
    };
    handleCancel = (e) => { //新增取消
        e.preventDefault();
        this.setState({
            visible: false,
            departname:''
        });
    };
    showModalEdit= (code) => { //编辑弹窗
        this.setState({
            visible: true,
            type:code
        });

    };
    showModaldelete = (code) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            type:code
        });
    }
    deleteOk = () =>{ //删除确认
        console.log('删除成功',this.state.code)
        this.setState({
            deleteshow: false,
        });
    }
    deleteCancel = () =>{ //删除取消
        this.setState({
            deleteshow: false,
        });
    }
    
    selectopt =()=>{ //检索
        this.props.form.validateFields((err, values) => {
            if (!err) {
                  console.log('检索',values)                   
            }
        });
    }

    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;

        const columns = [{
                title: '序号',
                dataIndex: 'name',
                key: 'name',
                render: text => <span>{text}</span>,
            },{
                title: '名称',
                dataIndex: 'bianhao',
                key: 'bianbao',
                render: text => <span>{text}</span>,
            },{
                title: '是否默认',
                dataIndex: 'equ_type',
                key: 'equ_type',
                render: text => <span>{text}</span>,
            },{
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <div>
                    <Button onClick={()=>_this.showModalEdit(text.code)}>编辑</Button>
                    <span className="ant-divider" />
                    <Button onClick={()=>_this.showModaldelete(text.code)}>删除</Button>
                    </div>
                )
            }
        ];

        return (
            <div>
                <BreadcrumbCustom first="系统管理" second="部门管理" />
                <div className="shange">
                    <Row>
                        <Col span={12}>
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="名称">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请输入名称!' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={2}>
                            <Button type="primary" onClick={this.showModal}>新增</Button>                           
                        </Col>
                    </Row>
                <Row>
                    <Table columns={columns} dataSource={this.state.list} />
                </Row>
                </div>
                       
                <Modal title={this.state.type?'编辑分组':'新增分组'} visible={this.state.visible} onOk={this.handleCreate}
                  onCancel={this.handleCancel}
                >  
                    <Input className="departname" name="departname" value={this.state.departname} onChange={this.handleChange} />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                 onCancel={this.deleteCancel}
                >  
                  <p>确认删除吗？</p>  
                </Modal>
            </div>
        )
    }
}

export default Department=Form.create()(Department);