import React, { Component } from 'react';
import {Form,Input} from 'antd';
import {post} from "../../axios/tools";
import "../../style/publicStyle/publicStyle.css";
const FormItem = Form.Item;
let vis=false;
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
        },()=>{
            this.requestdata()
        });
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.visible !== vis){
            if(nextProps.visible){
                vis=nextProps.visible;
                this.setState({
                    code:nextProps.code
                }, () => {
                    this.requestdata()});
            }
        }
             
    }
    requestdata=(params) => {//取数据
        if(this.state.code){
            post({url:"/api/companyuser/getone",data:{code:this.state.code} }, (res)=>{
                    this.props.form.setFieldsValue({
                    // realname: `${res.data.realname}`,
                    account: `${res.data.account}`,
                    // emailaddress: `${res.data.emailaddress}`,
                    });
            })
        }
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return this.props.form;
    };

    onChange = (checkedList) => { //分组选择
        this.setState({
            checkedList:checkedList.target.value
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        // const plainOptions = ['Apple', 'Pear', 'Orange']; //分組
        return (
            <div className="tc-label">
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem label="账号(手机号)">
                        {getFieldDecorator('account', {
                            rules: [{
                                required: true, message: '请输入手机号!',
                                pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g")
                            }],
                        })(
                            <Input className="ModelFormInput" disabled={this.state.code?true:false} />
                        )}
                    </FormItem>
                </Form>
            </div>

        )
    }


}

export default ModalForm = Form.create({})(ModalForm);