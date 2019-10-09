import React from 'react';
import {Row, Col, Button, DatePicker, LocaleProvider, Table, Form, Select,Modal,Spin} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {post} from "../../axios/tools";
import "../../style/ztt/css/patrolRecord.css";
import PatrolRecordModel from "./PatrolRecordModel";
import moment from "moment";
import "../../style/publicStyle/publicStyle.css";
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class PatrolRecord extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],//巡更记录列表
            patrolImg:false,
            equipment:[],//设备
            page:1, //当前页
            loading:true,
            cid:"", //检索选中的设备
        }
        
    }
    componentDidMount() {
        this.patrolList();
        this.handlePatrol();
    }
 
    patrolStatus =(item)=>{
        this.setState({
            patrolImg:true,
            patrolImgStatus:item,
        });
    };
    //model close
    patrolCancel =()=>{
        this.setState({
            patrolImg:false
        });
        this.patrolList();
    };

  
    //通过 不通过
    patrolAdopt = (item,type,index)=>{
        post({url:"/api/patrolresult/patrolconfirm",data:{code:item,phandle:type}},(res)=>{
            let lists=this.state.dataSource;
            lists[index].phandle=res.data[0].phandle;
            this.setState({
                dataSource:lists
            });
        });
    };
    //巡更列表信息
    patrolList =()=>{
        const params={
            pagesize:10,
            ifhandle:1,
            pageindex:this.state.page,
            bdate:this.state.bdate,
            edate:this.state.edate,
            cid:this.state.cid
        }
        post({url:"/api/patrolresult/getlist",data:params},(res)=>{
            if(res.success){
                this.setState({
                    dataSource:res.data,
                    total:res.totalcount,
                    loading: false,
                })
            }
        });
    };
    //设备
    handlePatrol =()=>{
        post({url:"/api/camera/get_cameralist"},(res)=>{
           if(res.success){
               this.setState({
                   equipment:res.data
               })
           }
        })
    };
    //查询
    handlePatrolSelect =(e)=>{
       e.preventDefault();
       this.props.form.validateFields((err, values) => {
                this.setState({
                    pagesize:18,
                    pageindex:this.state.page,
                    bdate:values.range_picker1.length?values.range_picker1[0].format("YYYY-MM-DD"):"",
                    edate:values.range_picker1.length?values.range_picker1[1].format("YYYY-MM-DD"):"",
                    cid:values.cid,
                })
        })
        this.setState({
            page:1,
            loadding:true,
        },()=>{
            this.patrolList()
        })
    };
    changePage=(page,pageSize)=>{ //分页  页码改变的回调，参数是改变后的页码及每页条数
        this.setState({
            page: page,
        },()=>{
            this.patrolList()
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const haveborder = true;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text,record,index) => (index+1)
        }, {
            title: '巡更图',
            dataIndex: 'ppic',
            key: 'ppic',
            render: (text,record) => {
                return(
                    <div><img src={text} alt="" width="100px" height="50px" onClick={()=>this.patrolStatus(record.code)} /></div>
                )
            },
        }, {
            title: '巡更人',
            dataIndex: 'handlename',
            key: 'handlename',
        },{
            title: '日期',
            dataIndex: 'ptime',
            key: 'ptime',
        },{
            title: '班次',
            dataIndex: 'pteam',
            key: 'pteam',
            render:(text,record)=>{
                return(
                   text?text+'('+record.pbdate+':00 —— '+record.pedate+':00) ':""
                )
            }
        },{
            title: '设备名称',
            dataIndex: 'cameraname',
            key: 'cameraname',
            render: text => <span>{!text?'测试':text}</span>,
        },{
            title: '处理人',
            dataIndex: 'phaccount',
            key: 'phaccount',
            render: text => <span>{!text?'AI主机':text}</span>,
        },{
            title: '处理结果',
            dataIndex: 'phandle',
            key: 'phandle',
            render: text => <span>{text===1?<p style={{color:'#FFF'}}>通过</p>:<p style={{color:'#f5222d'}}>不通过</p>}</span>,
        },{
            title: '操作',
            dataIndex: 'code',
            key: 'code',
            width:200,
            render:(text,record,index)=>{
                return(
                    <div>
                        <Button className="adoptBtn" onClick={()=>this.patrolAdopt(record.code,1,index)}>通过</Button>
                        <Button className="nopass deleteBtn" onClick={()=>this.patrolAdopt(record.code,2,index)}>不通过</Button>
                    </div>
                )
            }
        }];
        return(
            <LocaleProvider locale={zh_CN}>
                <div className="PatrolRecord">
                    <Row className="patrolTop">
                        <Form layout="inline" onSubmit={this.handlePatrolSelect} className="rangeForm">

                                <Form.Item
                                label="日期"
                                >
                                {getFieldDecorator('range_picker1')(
                                    <RangePicker placeholder={['开始时间', '结束时间']} />
                                )}
                            </Form.Item>
                            
                            <Form.Item
                                label="设备"
                            >
                                {getFieldDecorator('cid',{
                                    initialValue:""
                                } )(
                                    <Select style={{ width: 120 }}>
                                        <Option value="" >所有</Option>
                                        {
                                            this.state.equipment.map((v,i)=>(
                                                <Option value={v.code} key={v.code}>{v.name}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className="queryBtn"
                                    htmlType="submit"
                                >
                                    查询
                                </Button>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Spin spinning={this.state.loading} className="spin" size="large"tip="加载中..." />

                    <Row className="patrolTop">
                        <Col span={23}>
                            <Table dataSource={this.state.dataSource} columns={columns}
                             pagination={{defaultPageSize:10,current:this.state.page, total:this.state.total,onChange:this.changePage}}
                             bordered={haveborder}
                            />
                        </Col>
                        <Modal
                            width={700}
                            title="巡更记录详情"
                            visible={this.state.patrolImg}
                            onOk={this.patrolOk}
                            onCancel={this.patrolCancel}
                            footer={null}
                        >
                        <PatrolRecordModel visible={this.state.patrolImg} code={this.state.patrolImgStatus} par={1} />
                        </Modal>
                    </Row>
                </div>
            </LocaleProvider>
        )
    }
}
export default PatrolRecord=Form.create()(PatrolRecord);
