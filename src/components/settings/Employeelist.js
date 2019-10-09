import React, { Component} from 'react';
import ModalForm from './ModalForm.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import {Form, Input, Row, Col, Button, Modal, Table, Spin, message,LocaleProvider } from 'antd';
import {post} from "../../axios/tools";
import "../../style/publicStyle/publicStyle.css";
const FormItem = Form.Item;
const usertype=JSON.parse(localStorage.getItem('user'));
class Adminteam extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            createinfo:[],
            page:1, //当前页
            loading:true,
        };
    }
    componentDidMount() {
        this.requestdata()
        let utypes= localStorage.getItem("user");
        let utypeObj=JSON.parse(utypes);
        this.setState({
            utype: utypeObj.utype
        })
    }
    requestdata =(params={ pagesize:10,pageindex:this.state.page,}) => {//取数据
        post({url:"/api/companyuser/getlist",data:params}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data,
                    total:res.totalcount,
                    loading: false,
                })
            }
        })
    }
    changePage=(page)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.requestdata();
        })

    }
    showModal = (e) => { //新增弹窗
        e.preventDefault();
        this.setState({
            visible: true,
            type:0,
        });
    };
    handleCreate = (e) => {//modal提交
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
                if(!this.state.type){
                    const data={
                        realname:values.realname,
                        account:values.account,
                        emailaddress:values.emailaddress,
                    }
                    post({url:"/api/companyuser/add",data:data}, (res)=>{
                        if(res.success){
                            message.success('新增成功')
                            data.code=res.code;
                            const list=this.state.list;
                            list.unshift(data);
                            this.setState({
                                list:list,
                                visible: false,
                            })
                            forms.resetFields();
                            this.setState({
                                page:1,
                            },()=>{
                                this.requestdata();
                                this.props.form.setFieldsValue({
                                    "account":'',
                                    "realname":''
                                })
                            })
                        }
                    })
                }else{
                    forms.resetFields()
                }

            }
        });
    };

    handleCancel = (e) => { //modal取消
        const forms=this.formRef.formref();
        e.preventDefault();
        this.setState({
            visible: false,
        });
        forms.resetFields();
    };
    showModaldelete = (code,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            index:index,
            code:code
        });
    }
    deleteOk = () =>{
        const data={
            code:this.state.code,
        };
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/companyuser/del",data:data}, (res)=>{
            if(res.success){
                message.success('删除成功')
                this.setState({
                    list:list,
                    deleteshow: false,
                })
            }
        })
    };

    deleteCancel = () =>{ //删除取消
        this.setState({
            deleteshow: false,
        });
    }
    selectopt = (e) => { //检索search
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    page:1,
                    loading: true,
                },()=>{
                    this.requestdata(values)
                })
            }
        })
    };

    render() {
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        const isbordered = true;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record,index) => (index+1)
            },{
                title: '账号',
                dataIndex: 'account',
                key: 'deveui',
                render: text => <span>{text}</span>,
            },{
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
                render: text => <span>{text}</span>,
            },{
                title: '邮箱',
                dataIndex: 'emailaddress',
                key: 'emailaddress',
                render: text => <span>{text}</span>,
            },{
                title: '身份',
                dataIndex: 'utype',
                key: 'utype',
                render: text => <span>{text?'系统使用人员':' 管理员'}</span>,
            },{
                title: '操作',
                key: 'code',
                dataIndex: 'code',
                render: (text,record,index) => {
                    if(record.utype){
                        return(
                            <div>
                                <Button style={this.state.utype === "0"?{display:"block"}:{display:"none"}} onClick={()=>_this.showModaldelete(text,index)} className="deleteBtn">删除</Button>
                            </div>
                        )
                    }
                }
            }
        ];
        return (
            <LocaleProvider locale={zh_CN}>
            <div className="warrper" style={{margin:'20px 10px',minHeight:'600px' }}>
                <div className="shange">
                    <Row className="row-query" style={{ marginBottom:'30px' }}>
                        <Col span={22} className="col-employ-queryinput">
                            <Form layout="inline" onSubmit={this.selectopt}>
                                <FormItem label="姓名">
                                    {getFieldDecorator('realname', {
                                        rules:[{
                                            required: false,
                                            message: '请输入名称!'
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label="账号">
                                    {getFieldDecorator('account', {
                                        rules: [{
                                            required: false,
                                            message: '请输入账号!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="queryBtn">
                                        查询
                                    </Button>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={2} style={{textAlign:'right' }}>
                            <Button style={this.state.utype === "0"?{display:"block"}:{display:"none"}} onClick={this.showModal} className="queryBtn">新增</Button>
                        </Col>
                    </Row>
                    <Spin spinning={this.state.loading} className="spin" size="large"tip="加载中..." />
                    <Row>
                        <Col style={{ minHeight:'600px' }}>
                            <div>
                                <Table columns={columns}
                                       dataSource={this.state.list}
                                       bordered={isbordered}
                                       pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage,hideOnSinglePage:true}}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <Modal title="新增"
                       okText="确认"
                       cancelText="取消"
                       visible={this.state.visible}
                       onOk={this.handleCreate}
                       onCancel={this.handleCancel}
                >
                    <ModalForm visible={this.state.visible}
                               code={this.state.type}
                               index={this.state.index}
                               wrappedComponentRef={(form) => this.formRef = form}
                    />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       width={370}
                       onCancel={this.deleteCancel} okText="确认" cancelText="取消"
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
            </LocaleProvider>
        )
    }
}

export default Adminteam=Form.create()(Adminteam);