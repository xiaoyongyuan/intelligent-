import React, {Component} from 'react';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import '../../style/ztt/css/Companyhome.css';
import {queryString} from "../../utils/index";
import {post} from "../../axios/tools";
import Equipment from '../userhome/Equipment';
//图标
import nopic from '../../style/imgs/nopic.png';
class Companyscene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sceneCards: [],
            nowTimes: [],
            title: [],
            cloudDate: [],
            cardContext: [],
            equipmentNumber: [],
            onlineNumber: [],
            cameraCard: 0, //设备数
            usercount: 0, //账号用户数
            adminname: '', //管理员
            scenegraph:nopic,
        }
    }

    componentDidMount() {
        post({url: "/api/company/getone"}, (res) => {
            if (res.success) {
                this.setState({
                    title: res.data.cname,
                    cloudDate: res.data.clouddate,
                    pname: res.data.pname, //所属团队
                    cameranum: res.camera.length,
                    usercount: res.usercount,
                    adminname: res.data.adminname, //管理员
                    scenegraph:res.data.scenegraph?res.data.scenegraph:nopic, //场景图
                })
            }
        })
    }

    getParams = () => {
        queryString();
    }
    classColor = (state) => {
        if (state === 1) {
            return 'LANCardHeaderColor LANCardHeader';
        } else if (state === 2) {
            return 'LANCardHeaderColor2 LANCardHeader';
        } else if (state === 3) {
            return 'LANCardHeaderColor3 LANCardHeader';
        } else if (state === 4) {
            return 'LANCardHeaderColor4 LANCardHeader';
        }
    };
    fontColor = (state) => {
        if (state === 1) {
            return 'titleColor jiYu_font listContext';
        } else if (state === 2) {
            return 'titleColor2 jiYu_font listContext';
        } else if (state === 3) {
            return 'titleColor3 jiYu_font listContext';
        } else if (state === 4) {
            return 'titleColor2 jiYu_font listContext';
        }
    }
    LANstate = (state) => {
        if (state === 4) {
            return "Lanstate"
        }
    }

    render() {
        return (
            <div className="gutter-example button-demo">
                <Row className="gutter-row" gutter={10}>
                    <div className="mapOne">
                        <Row gutter={10}>
                            <Col xl={24} xxl={20} className="changjing_title"><h3 className="blockFont">{this.state.title}</h3></Col>
                        </Row>
                        <Row gutter={10}>
                            <Col xl={9} xxl={9}>
                                <img src={this.state.scenegraph} className="img-responsive" alt="test"
                                     style={{width:"100%", height: "220px"}}/>
                            </Col>
                            <Col xl={8} xxl={6}>
                                <Row className="cloud_data">
                                    <Col xl={15} xxl={15} offset={1} className="cloud_title">云服务到期日期: {this.state.cloudDate ?
                                        <span style={{color: '#1890ff'}}>{this.state.cloudDate}</span> :
                                        <span>无期限</span>}</Col>
                                </Row>
                                <Row className="cloud_data">
                                    <Col offset={1}>设备总数: {this.state.cameranum ? this.state.cameranum : 0}</Col>
                                </Row>
                                <Row className="cloud_data">
                                    <Col offset={1}>所属团队: {this.state.pname ? this.state.pname : '未绑定'}</Col>
                                </Row>
                                <Row className="cloud_data">
                                    <Col offset={1}>用户数: {this.state.usercount ? this.state.usercount : 0}</Col>
                                </Row>
                                <Row className="cloud_data">
                                    <Col offset={1}>管理员: {this.state.adminname ? this.state.adminname : '********'}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Row>
                <Equipment/>


            </div>
        );
    }
}

export default Companyscene