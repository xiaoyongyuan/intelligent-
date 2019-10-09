import React, { Component } from 'react';
import '../../style/sjg/home.css';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {Form,Table, Row, Col, Button,Radio, Modal,Select,message,LocaleProvider } from 'antd';
import moment from 'moment';
import {post} from "../../axios/tools";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class Setarea extends Component {
    constructor(props){
        super(props);
        this.state= {
            status: 1,
            form: false,
            checkedList:"weekday",
            cid:'',
            disabledStyle:false
        }
    }
    componentWillMount=()=>{
        this.setState({
            cid:this.props.query.id
        });
    }
    componentDidMount() {
        //取数据
        this.requestdata()
    }
    requestdata=() => {//取数据
        post({url:"/api/workingtime/getlist",data:{cid:this.state.cid}}, (res)=>{
            if(res.success){
                this.setState({
                    list: res.data
                })
            }
        })
     }
    onChange_radio=(checkedList)=>{//单选
        this.setState({
            checkedList:checkedList.target.value
        });
    }
    showModaldelete = (code,index,record) =>{ //删除弹层
        this.setState({
            deleteshow: true,
            type:code,
            index:index
        });
    }
//删除确认
    deleteOk = (code,index) =>{
        const data={
            code:this.state.type,
        }
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/workingtime/del",data:data}, (res)=>{
            if(res.success){
                this.setState({
                    list:list,
                    deleteshow: false,
                })
                message.success('删除成功'); 
            }
        })
    };
    deleteCancel = () =>{//删除取消
        this.setState({
            deleteshow: false,
        });
    };
    switch = (code,index)=>{ //状态开关

        const stype=this.state.list[index].cwstatus?0:1
        const data={
            cwstatus:stype,
            code:code
        }
        const list=this.state.list;
        list[index].cwstatus=stype;
        post({url:"/api/workingtime/update",data:data}, (res)=>{
            if(res.success){
                this.setState({
                    list:list
                },()=>{
                    if(stype===1){
                        message.success('开启成功'); 
                    }else{
                        message.success('关闭成功'); 
                    }
                })
                
            }
        })
    };
    add = (e) => {//新增
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(values.bdate===null||values.edate===null){
                message.success('请选择时间');
             }
            if(!err){
                const data={
                    starttime:values.bdate,
                    endtime:values.edate,
                    wtype:this.state.checkedList,
                    cwstatus:1,
                    cid:this.state.cid,
                };
                if(values.bdate<values.edate){
                 post({url:"/api/workingtime/add",data:data}, (res)=>{
                    if(res.success){
                        data.code=res.code;
                        const list=this.state.list;
                        list.unshift(data);
                        this.setState({
                            list:list,
                        });
                        message.success('新增成功');
                    }
                    
                })
              }else{
                message.warning('开始时间不能大于结束时间');
             }
            }
            this.props.form.resetFields();
        })
  
    }
    render() {
        const format = 'HH';
        const _this=this;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record,index) => (index+1)
            },
            {
                title: '时间',
                dataIndex: 'starttime',
                key: 'createon',
                render: (text, record,index) => (
                    <span>
                        {record.starttime}<span>:00:00</span>----{record.endtime}<span>:00:00</span>
                    </span>
                ),
            }, {
                title: '类型',
                dataIndex: 'wtype',
                key: 'wtype',
                render: (text, record) => {
                    switch(text){
                        case 'weekday':
                            return ('工作日');
                        case 'today':
                            return ('每天');
                        default:
                            return ('周末');
                    }
                },
            },
            {
                title: '状态',
                dataIndex: 'cwstatus',
                key: 'cwstatus',
                render: (text) => {
                    switch(text){
                        case 1:
                            return ('开启');
                        default:
                            return ('关闭');
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'code',
                key: 'code',
                render: (text, record,index) => (
                    <span>
                        <Button className="queryBtn" onClick={() => {this.switch(text,index);}}>{record.cwstatus?'关闭':'开启'}</Button>
                        <Button className="deleteBtn" onClick={()=>_this.showModaldelete(text,index,record)} >删除</Button>
                    </span>
                ),
            }];
        return (
            <LocaleProvider locale={zh_CN}>
            <div className="padding20 Settime">
                {/* <BreadcrumbCustom first="场景" second="布防时间" /> */}
                <Row style={{marginBottom:'20px'}}>
                    <Col span={24}>
                        <Form layout="inline" onSubmit={this.add}>
                            <FormItem label="开始时间">
                                {getFieldDecorator('bdate', {
                                    rules: [{ required: true, message: '请选择开始时间!' }],
                                })(
                                    <Select className="startTime" placeholder="开始时间">
                                        <option value="00">00</option>
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03" >03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                    </Select>

                                )}
                            </FormItem>
                            <FormItem label="结束时间">
                                {getFieldDecorator('edate', {
                                    rules: [{ required: true, message: '请选择结束时间!' }],
                                })(
                                    <Select className="startTime" placeholder="结束时间">
                                        <option value="00" >00</option>
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                    </Select>
                                )}

                            </FormItem>
                            <FormItem label="">
                                <RadioGroup onChange={this.onChange_radio} value={this.state.checkedList}>
                                    <Radio value={"weekday"}>工作日</Radio>
                                    <Radio value={"playday"}>周末</Radio>
                                    <Radio value={"today"}>每天</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem>
                                <Button className="queryBtn" htmlType="submit">
                                    新增
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={this.state.list} />
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel} okText="确认" cancelText="取消"
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
            </LocaleProvider>
        )
    }
}
export default Setarea=Form.create()(Setarea);
