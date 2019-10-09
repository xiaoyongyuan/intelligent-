import React, { Component } from 'react';
import { Card, Form, Input, Row, Col, Button } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
const FormItem = Form.Item;
class Deveicedet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            confirmDirty: false,
            isDeal: false

        };
    }
    componentDidMount(e) {
        this.setState({
        })
        //取数据
       console.log(e);
        this.requestdata();
    }
    requestdata=(params) => {//取数据
        axios.get("table.json",params)
            .then((res)=>{
            if(res.data.success){
                console.log(res.data.data);
                this.setState({
                    list: res.data.data
                })
            }

        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
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
                <BreadcrumbCustom first="" second="" />
                <Row className="white">
                    <Col className="gutter-row" span={10}>
                        <div className="gutter-box">
                            <Card title="" bordered={false}>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="设备IP"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('IP', {
                                            rules: [{required: true, message: '请输入摄像头IP',whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="设备名称"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('用户名', {
                                            rules: [{required: true, message: '请输入用户名',whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="审核结果"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('审核结果', {
                                            rules: [{required: true,whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>

                                    <Row className="area_row">
                                        <Col span={4} offset={10} className="area_text">
                                            <Button type="primary" size="large">返回</Button>
                                        </Col>
                                    </Row>

                                </Form>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default Deveicedet= Form.create()(Deveicedet);
