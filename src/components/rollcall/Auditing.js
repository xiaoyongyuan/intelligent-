/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import '../../style/sjg/home.css';
import { Card, Form, Input, Row, Col, Button } from 'antd';

import BreadcrumbCustom from '../BreadcrumbCustom';
const FormItem = Form.Item;

class Auditing extends Component {
    state = {
        confirmDirty: false,
    };
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
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 8,
                },
            },
        };

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="维护团队管理" second="点名审核" />

                <Row className="white">
                    <Col className="gutter-row" span={10}>
                        <div className="gutter-box">
                            <Card title="" bordered={false}>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="摄像头IP"
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
                                        label="用户名"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('IP', {
                                            rules: [{required: true, message: '请输入用户名',whitespace: true}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>

                                    <Row className="area_row">
                                        <Col span={3} offset={5} className="area_text">
                                            区域：
                                        </Col>
                                        <Col span={10}>
                                            <div className="area">
                                                <img alt="1" src="../../style/logo.png" />
                                            </div>
                                        </Col>
                                        <Col span={1} className="area_col">
                                            <Button type="primary" >下载</Button>
                                        </Col>
                                    </Row>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" size="large">上传svg文件</Button>
                                        <Button type="primary" htmlType="submit" size="large">不通过</Button>
                                    </FormItem>
                                </Form>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}

// const BasicForm = Form.create()(Auditing);

export default Auditing= Form.create()(Auditing);