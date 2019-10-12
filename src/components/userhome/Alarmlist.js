import React from 'react';
import { DatePicker, Row, Col, Select, Button, Modal, Pagination, Form, message, Card, Spin, Switch, Icon } from "antd";
import "../../style/ztt/css/police.css";
import "../../style/publicStyle/publicStyle.css";
import "../../style/cby/css/almListChang.css";

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { post } from "../../axios/tools";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Alarmdetails from "./Alarmdetails";
import damage from "../../style/imgs/damage.png";
import nodata from "../../style/imgs/nodata.png";
import banditpic from "../../style/imgs/banditpic.png";
import firepic from "../../style/imgs/firepic.png";
import "../../style/ztt/img/plioce/iconfont.css";
import moment from "moment";
const Option = Select.Option;
const { RangePicker } = DatePicker;
class Alarmlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activecompcode: props.auth.active ? props.auth.active.activecompanycode : '', //当前查看的公司
            type: [],
            visible: false,
            alarm: false,
            policeList: [],
            equipment: [],
            equipment1: [],
            alermType: [],
            loadding: true,
            alarmImgType: false,
            bdate: '',//检索的开始时间
            edate: '',//检索的结束时间
            cid: "", //检索选中的设备
            endOpen: false,
            page: 1, //当前页数
            pageSize: 18, //每页显示数量
            totalcount: 0, //数据总量
            toson: {}, //传给详情页面的值
            loading: 1,
            displaygreen: 'block',
            displayred: 'block',
            displayblue: 'block',
            backColor: '',//背景颜色
            nodatapic: true,
            ifclassion: false,
            queryBtn: true,
        };
    }
    componentWillMount() {
        if (this.props.query.id) {
            this.setState({
                cid: this.props.query.id,
                status: 0
            })
        }
    }
    componentDidMount() {
        this.handleEquipment();//设备select
        this.handleAlerm();//报警信息列表
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.auth.active.activecompanycode != nextState.activecompcode) {
            this.setState({
                activecompcode: nextProps.auth.active.activecompanycode,
                loadding: true,
                policeList: [],
                page: 1,
                bdate: '',
                edate: '',
                cid: "",
                ifclassion: false,
                ififdanger: 0,
                total: 0,
            }, () => {
                this.componentDidMount()
            })
        }
        return true;
    }
    handleCancelAlarmImg = () => {
        this.setState({
            alarmImgType: false,
            loadding: false,
        });
        this.handleAlerm();
    };
    //一键处理
    handleProcessing = () => {
        this.setState({
            alarm: true
        });
    };
    //摄像头
    handleOk = () => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    //查看报警详情
    alarmImg = (atype, code) => {
        if (atype == 1 || atype == 12) {
            if (this.state.bdate !== null && this.state.edate !== null) {
                var toson = {
                    code: code,
                    bdate: this.state.bdate,
                    edate: this.state.edate,
                    cid: this.state.cid,
                    ifdanger: this.state.ifdanger,
                    atype: atype
                };
            }
            this.setState({
                alarmImgType: true,
                toson
            })
        }
    }
    hanlePageSize = (page) => { //翻页
        this.setState({
            page: page,
        }, () => {
            this.handleAlerm()
        })
    };
    //报警信息列表
    handleAlerm = () => {
        const data = {
            bdate: this.state.bdate,
            edate: this.state.edate,
            ifdanger: this.state.ifdanger,
            cid: this.state.cid,
            status: this.state.status,
            pageindex: this.state.page,
            pagesize: 18,
            passivecode: this.state.activecompcode
        };
        post({ url: '/api/alarm/getlist', data: data }, (res) => {
            if (res.success) {
                this.setState({
                    displaysearch: true,
                })
                if (res.data.length === 0) {
                    this.setState({
                        nodatapic: false,
                    })
                } else {
                    this.setState({
                        nodatapic: true,
                    })
                }
                if (res.data.length || res.data.length === 0) {
                    this.setState({
                        policeList: res.data,
                        type: 1,
                        totalcount: res.totalcount,
                        loadding: false
                    })
                } else {
                    this.setState({
                        type: 0,
                        loadding: false
                    })
                }
            } else {
                this.setState({
                    loadding: false,
                    type: 0,
                })
            }
        })
    };
    //设备select
    handleEquipment = () => {
        post({ url: "/api/camera/get_cameralist", data: { passivecode: this.state.activecompcode } }, (res) => {
            if (res.success) {
                this.setState({
                    equipment: res.data,
                })
            }
        })
    };
    /*
    * 检索
    * 开始时间、结束时间、设备cid
    * */
    onChange = (date, dateString) => {
        this.setState({
            bdate: dateString[0],
            edate: dateString[1]
        });
    }
    handleSubmit = (e) => {
        var oldTimestart = (new Date(this.state.bdate)).getTime() / 1000;
        var oldTimeend = (new Date(this.state.edate)).getTime() / 1000;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.date && values.date.length) {

                if (oldTimeend - oldTimestart <= 604800) {
                    this.props.form.validateFields((err, values) => {
                        this.setState({
                            bdate: values.date && values.date.length ? values.date[0].format("YYYY-MM-DD HH:00:00") : "",
                            edate: values.date && values.date.length ? values.date[1].format("YYYY-MM-DD HH:00:00") : "",
                        });
                    });
                    this.setState({
                        ifdanger: values.ifdanger ? 1 : 0,
                        cid: values.cid,
                        status: '',
                        displaysearch: false,
                        page: 1,
                        loadding: true,
                    }, () => {
                        this.handleAlerm();
                    });
                } else {
                    message.error('请选择七天以内的时间');
                }
            } else {
                this.setState({
                    ifdanger: values.ifdanger ? 1 : 0,
                    cid: values.cid,
                    status: '',
                    displaysearch: false,
                    page: 1,
                    loadding: true,
                }, () => {
                    this.handleAlerm();
                });
            }
        });


    };
    //一键处理
    handleOnekey = (value) => {
        this.setState({
            handle: value
        })
    };
    //确认一键处理
    handleOkalarm = () => {
        if (this.state.handle !== undefined) {
            post({ url: "/api/alarm/handleall", data: { cid: this.state.handle } }, (res) => {
                if (res.success) {
                    message.success('处理成功');
                    this.setState({
                        alarm: false
                    }, () => {
                        this.handleAlerm();
                    });
                } else {
                    message.error('处理失败');
                }
            })
        } else {
            message.warn('请选择摄像头');
            return;
        }
    };
    //关闭一键处理页面
    handleCancelalarm = () => {
        this.setState({
            alarm: false
        })
    };

    redgreenblue = (status) => {
        if (status === 0) {
            return ("typeOrange");
        } else if (status === 1) {
            return ("typegreen");
        } else if (status === 2) {
            return ("typeblue");
        } else if (status === 3) {
            return ("typered");
        }
    };
    //报警状态
    handleState = (code) => {
        if (code === 0) {
            return "未处理";
        } else if (code === 1) {
            return "确认";
        } else if (code === 2) {
            return "忽略";
        } else if (code === 3) {
            return "虚警";
        }
    };
    sanjiaose = (status) => {
        if (status === 0) {
            return ("triangle-topright-green triangleOrange");
        } else if (status === 1) {
            return ("triangle-topright-green trianglegreen");
        } else if (status === 2) {
            return ("triangle-topright-green triangleblue");
        } else if (status === 3) {
            return ("triangle-topright-green trianglered");
        }
    }
    changeredgreenblue = (type, index, code) => {
        if (this.state.activecompcode) return;
        post({ url: '/api/alarm/update', data: { code: code, status: type } }, (res) => {
            if (res.success) {
                const policeList = this.state.policeList;
                policeList[index].status = type;
                this.setState(policeList);
            }
        });
    }
    atypeimg = (type, img) => {
        switch (type) {
            case 1:
                return img;
            case 401:
                return img;
            case 110:
                return banditpic;
            case 119:
                return firepic;
            case 12:
                return img;
            case 402:
                return damage;
            default:
                return nodata;
        }
    };
    disabledDate = (current) => {
        return current > moment().endOf('day');
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="Alarmlist">
                {/* <LocaleProvider locale={zh_CN}> */}
            <div className="Ala_list_tit_sc">
              <Row style={{ marginTop: "40px", backgroundColor:"#fff",padding:"25px 15px"  }}>
                   <Form onSubmit={this.handleSubmit} layout="inline" className="formIndex">
                            <Form.Item label="日期" >
                                {getFieldDecorator('date')(
                                    <RangePicker
                                        onChange={this.onChange}
                                        showTime={{ format: 'HH:00:00' }}
                                        format="YYYY-MM-DD HH:00:00"
                                        placeholder={['开始时间', '结束时间']}
                                        disabledDate={this.disabledDate}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="设备"  style={{padding:"0 30px"}}>
                                {getFieldDecorator('cid', {
                                    initialValue: "",
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value="" >所有</Option>
                                        {
                                            this.state.equipment.map((v, i) => (
                                                <Option value={v.code} key={v.code}>{v.name}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            {/* <Col xl={4} xxl={3} className="switch_lr">
                                <Form.Item label="只看收藏" >
                                    {getFieldDecorator('ifdanger')(
                                        <Switch checkedChildren="开" unCheckedChildren="关" />
                                    )}
                                </Form.Item>
                            </Col> */}
                           <Form.Item  style={{paddingLeft:"20px"}}>
                               <Button type="primary" htmlType="submit" className="queryBtn">查询</Button>
                           </Form.Item>
                            {/* <Col xl={2} xxl={2} lg={6} className="lr">
                                <Button onClick={this.handleProcessing} className="processingBtn" disabled={this.state.activecompcode ? true : false}>一键处理</Button>
                            </Col> */}
                        </Form>
              </Row>
            </div>
                {/* </LocaleProvider> */}
                <Spin size="large" spinning={this.state.loadding} tip="加载中..." className="loadding" />
                {this.state.nodatapic ? "" :
                    <Row style={{ marginTop: "70px", }}>
                        <Col style={{ width: "100%", textAlign: "center" }}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                    </Row>}

            <Row style={{ marginTop: "20px", display: this.state.type === 0 ? "none" : "block", }} gutter={20}>
                    {
                        this.state.policeList.map((v, i) => (
                             <Col xl={6} xxl={4}  key={v.code} style={{ display: this.state.displaysearch === true ? " block" : "none" }} >
                            <Card
                                className="listmargintop"
                              cover={<div className="pliceImgyal" onClick={() => this.alarmImg(v.atype, v.code)}>
                                <img src={this.atypeimg(v.atype, v.pic_min)} alt="" />
                              </div>}

                            >
                              <div className = "al_chang_box">
                                <p className="al_chang_p clearfix" title={v.name}><span>设备名称：</span><span>{v.name}</span> </p>
                                <p className="al_chang_p clearfix"><span>入侵类型：</span><span>{v.alarmtype}</span> </p>
                                <p className="al_chang_p clearfix"><span className="clearfix"> <b className="fl">时</b><b className="rg">间：</b>  </span><span>{v.atime}</span> </p>
                                <p className="al_chang_p clearfix" style={{ visibility: v.atype == 12 ? "hidden" : "visible" }}><span>报警对象：</span> <span>{v.tags === "" ? "无" : v.tags}</span></p>
                                <h5 style={{ color: "#FF7D46" }}>{this.handleState(v.status)}</h5>
                              </div>
                            </Card>,


{/*
                                <div className="listmargintop">
                                    <div className={this.redgreenblue(v.status)} >
                                        <Row>
                                            <div className={this.sanjiaose(v.status)} style={{ display: v.atype == 12 ? "none" : "block" }}>
                                                <span className="xuanzhuan" >{this.handleState(v.status)}</span>
                                            </div>
                                            <Col span={8}>
                                                <div className="pliceImgyal" onClick={() => this.alarmImg(v.atype, v.code)}>
                                                    <img src={this.atypeimg(v.atype, v.pic_min)} alt="" />
                                                </div>
                                            </Col>
                                            <Col span={16} className="r_flex">
                                                <Row className="row-alarmlist-detail">
                                                    <Col span={20}>
                                                        <Row className="word-row">
                                                            <Col span={18}>
                                                                <Row>
                                                                    <Col span={14} style={{ marginLeft: '5px' }} push={1}>
                                                                        <p className="fontstyle time-col" title={v.name}>{v.name}</p>
                                                                    </Col>
                                                                    <Col span={9} push={4}>
                                                                        <p className="fontstyle time-col typeUnknown">{v.alarmtype}</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className="word-row">
                                                            <Col span={13} push={1}>
                                                                <p className="time-col fontstyle fontstyletime">{v.atime}</p>
                                                            </Col>
                                                            <Col span={9} push={1} style={{ marginLeft: '13px' }} >
                                                                <p className="fontstyle time-col" style={{ display: v.atype == 12 ? "none" : "block" }}>报警对象：{v.tags === "" ? "无" : v.tags}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                <Row className="sure-row" type="flex" align="bottom" style={{ display: v.atype == 12 ? "none" : "block" }}>
                                                    <Col span={8} >
                                                        <div className="sure-col-l" onClick={() => this.changeredgreenblue(1, i, v.code)}>
                                                            <div className="circle-sure" />
                                                            <div className="word-sure">确认</div>
                                                        </div>
                                                    </Col>
                                                    <Col span={8} >
                                                        <div className="sure-col-c" onClick={() => this.changeredgreenblue(3, i, v.code)}>
                                                            <div className="circle-xj" />
                                                            <div className="word-xj">虚警</div>
                                                        </div>
                                                    </Col>
                                                    <Col span={8} >
                                                        <div className="sure-col-r" onClick={() => this.changeredgreenblue(2, i, v.code)}>
                                                            <div className="circle-hl" />
                                                            <div className="word-hl">忽略</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div> */}
                            </Col>
                        ))
                    }
                </Row>
                <Pagination hideOnSinglePage={true} defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" style={{ display: this.state.type === 1 ? "block" : "none" }} />
                <Modal
                    title="播放视频"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                />
                <Modal
                    title="报警批量处理"
                    visible={this.state.alarm}
                    onOk={this.handleOkalarm}
                    onCancel={this.handleCancelalarm}
                    okText="确认"
                    cancelText="取消"
                >
                    <div>
                        摄像头选择：
                        <Select defaultValue="请选择摄像头" style={{ width: 180 }} onChange={this.handleOnekey}>
                            {
                                this.state.equipment.map((v, i) => (
                                    <Option value={v.code} key={i}>{v.name}</Option>
                                ))
                            }
                        </Select>

                    </div>
                </Modal>
                <div>
                    <Modal
                        width={1200}
                        title="报警详情"
                        visible={this.state.alarmImgType}
                        onCancel={this.handleCancelAlarmImg}
                        footer={null}
                    >
                        <Alarmdetails visible={this.state.alarmImgType} activecompcode={this.state.activecompcode} toson={this.state.toson} closeAlarm={this.handleCancelAlarmImg} />
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { auth } = state.httpData;
    return { auth };
};
export default withRouter(connect(mapStateToProps)(Alarmlist = Form.create()(Alarmlist)));
