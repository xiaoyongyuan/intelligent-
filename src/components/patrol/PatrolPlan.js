import React from 'react';
import {Form, Row, Col, Button, Modal, Icon, Card, message, Spin} from 'antd';
import ModalForm from './ModalForm.js';
import {post} from "../../axios/tools";
import '../../style/sjg/home.css';
import '../../style/sjg/patrol.css';
import nodata from "../../style/imgs/nodata.png";

class PatrolPlan extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
            list:[],
            loading:true,
            type:true,
            nodataType:false,
        };
    }
    componentDidMount() {
        this.requestdata()
    }
    requestdata=() => {//取数据
        post({url:"/api/patrol/getlist"}, (res)=>{
            if(res.success){
                this.setState({
                    resdatd:res,
                    list: res.data,
                    loading: false,
                    nodataType: true,
                });
                if(res.data.length===0){
                    this.setState({
                        type:false
                    });
                }
                if(res.data.length>0){
                    this.setState({
                        type:true
                    });
                }
            }else{
                this.setState({
                    loading:true
                });
            }
        })
    };
    showModaldelete = (code,index) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            delcode:code,
            delindex:index.i
        });
    };
    deleteOk = () =>{//删除确认
        let code={
            code:this.state.delcode,
        };
        post({url:"/api/patrol/del",data:code},(res)=>{
            if(res.success){
                const list=this.state.list;
                list.splice(this.state.delindex,1);
                this.setState({
                    deleteshow: false,
                    list
                });
                message.success('删除成功');
            }
        })
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
    };
    showModal = (e) => { //新增弹窗
        e.preventDefault();
        if(this.state.list.length < 6){
            this.setState({
                visible:true,
                type:0,
            });
        }else {
            message.warning('最多可以新增六个巡更');
        }

    };
    showModalEdit=(code,index)=>{ //编辑
        this.setState({
            visible: true,
            type:code,
            indexi:index.i
        });
    }
    handleCancel = (e) => { //modal取消
        const forms=this.formRef.formref();
        e.preventDefault();
        this.setState({
            visible: false,
        });
        forms.resetFields();
    };


    handleCreate = (e) => {//modal提交
        e.preventDefault();
        const forms=this.formRef.formref();
        forms.validateFields((err, values) => {
            if (!err) {
                if(this.state.type){
                    //修改
                    let data={
                        code:this.state.type,
                        pteam:values.pteam,
                        pbdate:values.bdate.format("HH"),
                        pedate:values.edate.format("HH"),
                        clist:values.patrolE.join(","),
                    };
                    if(values.bdate.format("HH")==="00"&&values.edate.format("HH")==="00"){
                        post({url:"/api/patrol/update",data:data},(res)=>{
                            if(res.success){
                                let list=this.state.list;
                                list[this.state.indexi]=res.data[0];
                                this.setState({
                                    list:list,
                                    visible: false,
                                },()=>{
                                    post({url:"/api/patrol/getlist"}, (res)=>{
                                        if(res.success){
                                            this.setState({
                                                list: res.data
                                            })
                                        }
                                    })
                                })
                            }
                        })

                    }else if(values.bdate.format("HH")<values.edate.format("HH")){
                        post({url:"/api/patrol/update",data:data},(res)=>{
                            if(res.success){
                                let list=this.state.list;
                                list[this.state.indexi]=res.data[0];
                                this.setState({
                                    list:list,
                                    visible: false,
                                },()=>{
                                    post({url:"/api/patrol/getlist"}, (res)=>{
                                        if(res.success){
                                            this.setState({
                                                list: res.data
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    }else{
                        message.warning('开始时间不能大于结束时间');

                    }
                }else{
                    const data={
                        pteam:values.pteam,
                        pbdate:values.bdate.format("HH"),
                        pedate:values.edate.format("HH"),
                        clist:values.patrolE.join(",")
                    }
                    if(values.bdate.format("HH")<=values.edate.format("HH")){
                        post({url:"/api/patrol/add",data:data}, (res)=>{
                            if(res.success){
                                data.code=res.code;
                                const list=this.state.list;
                                list.unshift(data);
                                this.setState({
                                    list:list,
                                    visible: false,
                                },()=>{
                                    post({url:"/api/patrol/getlist"}, (res)=>{
                                        if(res.success){
                                            this.setState({
                                                list: res.data,
                                                list_length:res.data.length
                                            })
                                        }
                                    })
                                })
                            }
                        })
                        forms.resetFields()//清空
                    }else{
                        message.warning('开始时间不能大于结束时间');
                    }

                }

            }
        });
    };

    bgcolor=(i)=>{
        if(i===0){
            return 'bg1'
        }else if(i===1){
            return 'bg2'
        }else if(i===2){
            return 'bg3'
        }
        else if(i===3){
            return 'bg4'
        }
        else if(i===4){
            return 'bg5'
        }
        else if(i===5){
            return 'bg6'
        }
    }

    render(){
        return(
            <div className="PatrolPlan">
                <Card className="margin_top50 card_width m-r card-center"
                      title="最多可以新增六个巡更"
                      extra={<Row>
                          <Col span={2} offset={6}>
                              <Button type="primary" className="queryBtn" onClick={this.showModal}>新增</Button>
                          </Col>
                      </Row>
                      }
                >
                    <Row>
                        <Spin spinning={this.state.loading} className="spin" size="large"tip="加载中..." />
                        <div style={{marginTop:"70px",display:this.state.nodataType?"none":"block"}}>
                            <div style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></div>
                        </div>
                        {
                            this.state.list.map((item,i)=>{
                                return(
                                    <Col key={i} className="margin_top50 m_r" span={7}>

                                        <div className="patrol_item">
                                            <div className="patrol_head">

                                                <div className={this.bgcolor(i)}>{this.state.list[i].pteam.toString().substring(0,2)}</div>
                                            </div>
                                            <div className="patrol_detail">
                                                <div className="coverflow">{this.state.list[i].pbdate}:00--{this.state.list[i].pedate}:00</div>
                                                <div className="coverflow">
                                                    { this.state.list[i].camera}
                                                </div>
                                            </div>
                                            <div className="patrol_query">
                                                <span style={{cursor:"pointer"}} onClick={() => {this.showModalEdit( this.state.list[i].code,{i})}}><Icon type="edit" />编辑</span>
                                            </div>
                                            <div className="del">
                                                <span style={{cursor:"pointer"}} onClick={() => {this.showModaldelete( this.state.list[i].code,{i})}}><Icon type="delete" />删除 </span>
                                            </div>

                                        </div>

                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Card>
                <Modal title={this.state.type?'编辑':'新增'}
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
                <Modal
                    title="提示信息"
                    okText="确认"
                    cancelText="取消"
                    visible={this.state.deleteshow} onOk={this.deleteOk}
                    onCancel={this.deleteCancel}
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }
}
export default PatrolPlan=Form.create()(PatrolPlan);
