import React, { Component } from 'react';
import {Form,Input, Row, Col, Button , Modal,Icon , Radio, Checkbox } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class ModalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false
        };
    }
    componentDidMount() {
        //编辑  数据回填
        this.setState({
            code:this.props.code
        });
        console.log('dddd',this.props.code)
        this.updatedata()
    }
    
    formref = () => { //将form传给父组件由父组件控制表单提交
        const aa=this.props.form.getFieldsValue(); 
        return this.props.form;
    };
    updatedata = () => {
        if(this.state.code){
            axios.get("table.json").then((res)=>{
                if(res.data.success){
                    let editdata=res.data.data[this.state.code];
                    this.props.form.setFieldsValue({
                      title: `${editdata.name}`,
                      jingdu: `${editdata.x}`,
                      weidu: `${editdata.y}`,
                      linkname: `${editdata.username ? editdata.username : "张三"}`,
                      tel: `${editdata.tel}`
                    });
                    
                }
            })
        }
    }; 
    componentDidUpdate = () => {
        if(this.props.code && this.props.code!=this.state.code){
            this.setState({
                code:this.props.code
            }, () => {this.updatedata() });
            
        }      
    }
    onChange = (checkedList) => { //分组选择
        this.setState({
          checkedList:checkedList.target.value
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const plainOptions = ['Apple', 'Pear', 'Orange']; //分組
        

        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem label="账号">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入名称!' }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="姓名">
                        {getFieldDecorator('jingdu', {
                            rules: [{ required: true, message: '请输入经度!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="分组">
                      <RadioGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                    </FormItem>
                    <FormItem label="权限">
                      {getFieldDecorator('Checkbox-group',{
                        initialValue: '2'
                      })(
                        <CheckboxGroup>
                          <Checkbox value="1">管理员</Checkbox>
                          <Checkbox value="2">使用人员</Checkbox>
                        </CheckboxGroup>
                      )}
                    </FormItem>
                </Form>

        )
    }


}

export default ModalForm = Form.create({})(ModalForm);