import React, { Component } from 'react';
import {Form,TimePicker,Input,Checkbox} from 'antd';
import {post} from "../../axios/tools";
import moment from 'moment';
import '../../style/sjg/patrol.css';
const FormItem = Form.Item;
let vis=false;
class ModalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            varr:[]
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code
        },()=>{
            this.requestdata()
        });
        post({url:"/api/camera/get_cameralist"}, (res)=>{ //获取摄像头
            if(res.success){
                  let codearr=[];
                res.data.map((el,i) => {
                    codearr.push({ label: el.name, value:el.code,})
                    return '';
                })
                this.setState({
                    plainOptions: codearr

                },()=>{
                })
            }
        })
    }
  
    componentWillReceiveProps(nextProps){
        if( nextProps.visible !== vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                 vis=nextProps.visible;
                this.setState({
                    code:this.props.code,
                },()=>{
                    if(nextProps.code===0){
                    }else{
                        post({url:"/api/patrol/getone",data:{code:nextProps.code} }, (res)=>{
                            this.props.form.setFieldsValue({
                                pteam: res.data.pteam,
                                bdate: moment(`${res.data.pbdate}`, 'HH'),
                                edate: moment(`${res.data.pedate}`, 'HH'),
                                patrolE:res.data.clist.toString().split(",").map(Number),

                            });
                            
                        })
                    }
                });
            }
        }

    }
    requestdata=() => {//数据回填
        const _this=this;
        if(_this.state.code){
            post({url:"/api/patrol/getone",data:{code:_this.state.code} }, (res)=>{
                    _this.props.form.setFieldsValue({
                        pteam: res.data.pteam,
                        bdate: moment(`${res.data.pbdate}`, 'HH'),
                        edate: moment(`${res.data.pedate}`, 'HH'),
                        patrolE:res.data.clist.toString().split(",").map(Number),   
                    });
            })
        }
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };
 
    render() {
        const CheckboxGroup = Checkbox.Group;
        const { getFieldDecorator } = this.props.form;
        const format = 'HH';
        const _this=this;
        let times=moment(this.state.timeList).format("HH");
        function onChange_time1(time, timeString) {
             _this.setState({
                timeList:time,
                timeString:timeString
            });
        }
        function onChange_time2(time, timeString) {
            _this.setState({
                timeList2:time,
                timeString:timeString
            });
        }
        function newArray(start, end) {
            let result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }

        function disabledHours() {
            let hours = newArray(0, 60);
            if(times === '00'){
                hours.splice(times,24-times);
            }else{
                hours.splice(parseInt(times)+1,24-times);
            }
            return hours;
        }
        
       
        return (
            <div className="patrol_detail_lable">
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                <FormItem label="班次名称">
                    {getFieldDecorator('pteam', {
                        rules: [{
                            required: true, message: '最多输入6个字', max:6, 
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="开始时间">
                    {getFieldDecorator('bdate', {
                        rules: [{ required: true, message: '请选择时间!' }],
                    })(
                        <TimePicker onChange={onChange_time1} defaultOpenValue={moment('00', format)}
                                    format={format} 
                        />
                    )}
                </FormItem>
                <FormItem label="结束时间">
                    {getFieldDecorator('edate', {
                        rules: [{ required: true, message: '请选择时间!' }],
                    })(
                        <TimePicker onChange={onChange_time2}
                                    disabledHours={disabledHours}
                                    format={format}
                        />
                    )}
                </FormItem>
                <FormItem label="巡更设备">
                            {getFieldDecorator('patrolE', {

                                rules: [{ required: true, message: '请选择巡更设备!' }],
                            })(
                                <CheckboxGroup options={this.state.plainOptions} onChange={this.onChangecheck} />
                            )}
                        </FormItem>
                </Form>
            </div>
        )
    }
}

export default ModalForm = Form.create({})(ModalForm);