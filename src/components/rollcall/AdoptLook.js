
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import {Card,Form,Input,Row,Col,Button,message,Radio,Select} from 'antd';
import {post} from "../../axios/tools";
import nopic from "../../style/imgs/nopic.png";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class AdoptLook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            imgsrc:nopic,
            present:[]
        };
    }
    componentWillMount(){
        this.setState({
            code:this.props.query.id
        })
    }
    componentDidMount(){
        const _this=this;
        post({url:"/api/rollcall/getone",data:{code:this.state.code}}, (res)=>{
            if(res.success){
                _this.props.form.setFieldsValue(
                {
                    cameraname: res.data.cameraname, //用户名
                    rname: res.data.rname, //对象名
                    applydate: res.data.applydate, 
                    rhandle: res.data.rhandle, //审核结果
                });
                _this.setState({
                    imgsrc: res.data.basepic, //图片
                    rpic:res.data.rpic,
                    rhandle: res.data.rhandle, 
                    rstatus:res.data.rstatus,
                    present: JSON.parse(res.data.rzone), //区域   
                },()=>{
                   this.draw() 
                })
            }
        })
    }
    draw = () => { //绘制区域
        let item=this.state.present;
        if(item.length){
            let ele = document.getElementById("time_graph_canvas");
            let area = ele.getContext("2d");
            area.strokeStyle='#ff0';
            area.lineWidth=1;
            area.beginPath();
            area.moveTo(parseInt(item[0][0]/2),parseInt(item[0][1]/2));
            item.map((elx,i)=>{
                if(i>0){
                   area.lineTo(parseInt(item[i][0]/2),parseInt(item[i][1]/2));
                   if(i===3){
                   area.lineTo(parseInt(item[0][0]/2),parseInt(item[0][1]/2));
                   } 
                   area.stroke();
                }
                return '';
            }) 
        }     
    }
    cancelhandle=()=>{ //不通过
        this.props.history.go(-1);
    }
    handleSubmit = (e) => { //点名对象状态变更
        e.preventDefault();
        const _this=this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                post({url:"/api/rollcall/update",data:{code:this.state.code,rstatus:values.rstatus}}, (res)=>{
                    if(res.success){
                        message.success('修改成功',1,function(){
                            _this.props.history.go(-1);
                       });
                    }
                })
            }
        });
    };

    render() {
        const _this=this;
        const isdisabled = true;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };


        return (
            <div className="gutter-example">
                <Row className="adoptlook-white">
                    <Col className="gutter-row" span={10}>
                        <div className="gutter-box">
                            <Card title="" bordered={false}>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="摄像头"
                                    >
                                        {getFieldDecorator('cameraname', {
                                            rules: [{required: false, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="对象名"
                                    >
                                        {getFieldDecorator('rname', {
                                            rules: [{required: false, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                    <Row className="area_row">
                                        <Col span={3} offset={5} className="area_text">
                                            区域：
                                        </Col>
                                        <Col span={10}>
                                            <canvas id="time_graph_canvas" width="352px" height="288px" style={{backgroundImage:'url('+this.state.imgsrc+')',backgroundSize:'100% 100%'}} onClick={this.clickgetcorrd} onMouseMove={this.drawmove} />
                                        </Col>
                                    </Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label="审核结果"
                                    >
                                        {getFieldDecorator('rhandle', {
                                            rules: [{required: false}],
                                        })(
                                            <Select disabled={isdisabled}>
                                              <Option value={0}>未审核</Option>
                                              <Option value={1}>审核通过</Option>
                                              <Option value={2}>审核未通过</Option>
                                            </Select>
                                        )}
                                    </FormItem>  
                                    {this.state.rhandle
                                        ?<div>{
                                            this.state.rpic
                                            ?<div>
                                                <Row className="area_row">
                                                    <Col span={4} offset={4} className="area_text">
                                                        对象图：
                                                    </Col>
                                                    <Col span={10}>
                                                        <img alt="3" src={this.state.rpic} width="100%" />
                                                    </Col>
                                                </Row>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="状态"
                                                >
                                                    {getFieldDecorator('rstatus', {
                                                        initialValue:_this.state.rstatus,
                                                        rules: [{required: true}],
                                                    })(
                                                        <RadioGroup onChange={this.statusChange}>
                                                            <Radio value={0}>关闭</Radio>
                                                            <Radio value={1}>开启</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>

                                            </div>
                                            :''

                                        }</div>
                                        :''
                                    }
                                    {
                                        this.state.rhandle===1
                                        ?<Row>
                                            <Col span={16} offset={8}>
                                                <Button type="primary" htmlType="submit" className="login-form-button" >提交</Button>
                                                <Button style={{display:"inline-block"}} onClick={this.cancelhandle} className="adoptBtn-fh">返回</Button>
                                            </Col>
                                        </Row>
                                        :''
                                    }
                                </Form>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default AdoptLook= Form.create()(AdoptLook);
