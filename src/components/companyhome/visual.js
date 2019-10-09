import React, { Component } from 'react';
import { Row,Col } from 'antd';
import '../../style/yal/css/datavisual.css';
import {post} from "../../axios/tools";
import equip from "../../style/yal/img/equip.png";
import team from "../../style/yal/img/team.png";
import usernum from "../../style/yal/img/usernum.png";
import admin from "../../style/yal/img/admin.png";
import Echartline from "./Echartline";
import Echartpie from "./Echartpie";
import moment from "moment";

const deveice=[{
    name:'神道西侧',
    ccom:'明秦王陵遗址',
    alarm:1282,
},{
    name:'神道东侧',
    ccom:'明秦王陵遗址',
    alarm:1159,
},{
    name:'神道入口',
    ccom:'明秦王陵遗址',
    alarm:18,
},{
    name:'15',
    ccom:'阿房宫',
    alarm:212,
}]

class Datavisual extends Component {
    constructor(props){
        super(props);
        this.state= {
            option:{},
            deveice:deveice,
            analysisCount:0,//总报警数
            unhandle:0,//未处理报警数
            okconfirm:0,//确认数
            xufalse:0,//虚报警数
            ignore:0,//忽略数
            today:moment().format('LL'),
        }
        this.saveRef = ref => {this.refDom = ref};
    }
    componentWillMount=()=>{
        this.setState({
            DHeight:document.documentElement.clientHeight-65+'px'
        })

    }
    componentDidMount() {
        const _this=this;
        window.onresize = () => {
            this.setState({
                DHeight:document.documentElement.clientHeight-65+'px'
            })
        }
    }
    render() {
        const _this=this;
        return (
            <div className="Datavisual" style={{height:this.state.DHeight}}>
                <div className="titletop">
                    <div className="titlevalue">
                        西安文物局
                    </div>
                </div>
                <Row gutter={24} className="warrper" >
                    <Col span={7} className="wcolum">
                        <div className="clunm">
                            <div className="lump">
                                <div className="titleechart">
                                    <span className="titlename">可查看单位</span>
                                </div>
                                <div className="comp">
                                    <Echartpie type="lookcomp" winhe={(parseInt(this.state.DHeight)*0.7-20)*0.5-50} />
                                </div>
                            </div>
                        </div>
                        <div className="clunm lumpbott">
                            <div className="lump ">
                                <div className="titleechart">
                                    <span className="titlename">可查看设备</span>
                                </div>
                                <div className="comp">
                                    <div className="equiptable">
                                        <div className="equipment equiphead">
                                            <Row className="lines">
                                                <Col className="gutter-row" xl={8}>
                                                    名称
                                                </Col>
                                                <Col className="gutter-row" xl={8}>
                                                    单位
                                                </Col>
                                                <Col className="gutter-row" xl={8}>
                                                    未处理报警数
                                                </Col>
                                            </Row>
                                        </div>
                                        {_this.state.deveice.map((el,i)=>(
                                            <div className="equipment equipbody" key={'row'+i}>
                                                <Row className="lines">
                                                    <Col className="gutter-row" xl={8}>
                                                        {el.name}
                                                    </Col>
                                                    <Col className="gutter-row" xl={8}>
                                                        {el.ccom}
                                                    </Col>
                                                    <Col className="gutter-row" xl={8}>
                                                        {el.alarm}
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={10} className="wcolummap">
                        <div className="mainmap">
                            <div className="titleechart">
                                <span className="titlename">下辖单位区位图</span>
                                <span className="today">当前日期:{this.state.today}</span>
                            </div>
                        </div>
                        <div className="maps">
                            <Echartpie type="xianmap" winhe={(parseInt(this.state.DHeight)*0.7-10)*0.8-60} xianmap={this.state.xianmap} />
                        </div>
                        <div className="draw">
                            <div className="untreated alarmtitle">
                                未处理报警
                            </div>
                            <div className="untreated alarmvalue">
                                13621
                            </div>
                        </div>
                    </Col>
                    <Col span={7} className="wcolum">
                        <div className="clunm">
                            <div className="lump">
                                <div className="titleechart">
                                    <span className="titlename">账号信息</span>
                                </div>
                                <div className="comp" style={{height:'calc(100% - 60px)'}}>
                                    <div className="yundate">
                                        云服务到期日期: <b>{this.state.today}</b>
                                    </div>
                                    <div className="newsclo" style={{height:'calc(100% - 55px)'}}>
                                        <Row className="message">
                                            <Col className="heihgdabo" span={10} offset={1}>
                                                <Row className="messthis">
                                                    <Col span={8}>
                                                        <div className="equiptu">
                                                            <img src={equip} alt="" />
                                                        </div>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <p className="sgxdword">设备总数</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="sgxdnum-row">
                                                            <Col span={24} className="sgxdnum-col">
                                                                <p className="sgxdword"><span className="sgxdnum">18</span> 个</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col className="heihgdabo" span={10} offset={2}>
                                                <Row className="messthis">
                                                    <Col span={8}>
                                                        <div className="equiptu">
                                                            <img src={team} alt="" />
                                                        </div>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <p className="sgxdword">所属团队</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="sgxdnum-row">
                                                            <Col span={24} className="sgxdnum-col">
                                                                <p className="sgxdword">维护团队</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className="message">
                                            <Col className="heihgdabo" span={10} offset={1}>
                                                <Row className="messthis">
                                                    <Col span={8}>
                                                        <div className="equiptu">
                                                            <img src={usernum} alt="" />
                                                        </div>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <p className="sgxdword">用户数</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="sgxdnum-row">
                                                            <Col span={24} className="sgxdnum-col">
                                                                <p className="sgxdword"><span className="sgxdnum">3</span> 个</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col className="heihgdabo" span={10} offset={2}>
                                                <Row className="messthis">
                                                    <Col span={8}>
                                                        <div className="equiptu">
                                                            <img src={admin} alt="" />
                                                        </div>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <p className="sgxdword">管理员</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="sgxdnum-row">
                                                            <Col span={24} className="sgxdnum-col">
                                                                <p className="sgxdword">15319403465</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clunm lumpbott">
                            <div className="lump">
                                <div className="titleechart">
                                    <span className="titlename">报警次数</span>
                                </div>
                                <div className="comp">
                                    <Echartline
                                        type="alarmnum"
                                        winhe={(parseInt(this.state.DHeight)*0.7-10)*0.5-10}
                                        alarmnumapg={this.state.alarmnumapg}
                                        alarmnumqwl={this.state.alarmnumqwl}
                                        timehour = {this.state.timehour}
                                        apgname={ this.state.apgname }
                                        qwlname = { this.state.qwlname }
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="warrperbottom">
                    <Col span={7} className="bottomheig">
                        <div className="wappscol">
                            <div className="titleechart">
                                <span className="titlename">野外文物点名</span>
                            </div>
                            <div className="comp">
                                <Echartline
                                    type="rollcall"
                                    winhe={parseInt(this.state.DHeight)*0.3-70}
                                    rollcallNumqwl = { this.state.rollcallNumqwl }
                                    dmdayly = { this.state.dmdayly }
                                    rollcallNameqwl = { this.state.rollcallNameqwl }
                                />
                            </div>
                        </div>
                    </Col>
                    <Col span={10} className="bottomheig" style={{paddingRight:0}}>
                        <div className="wappscol">
                            <div className="titleechart">
                                <span className="titlename">报警分析</span>
                            </div>
                            <div className="comp">
                                <Echartpie type="alarmanalyze" winhe={parseInt(this.state.DHeight)*0.3-70} />
                            </div>
                        </div>
                    </Col>
                    <Col span={7} className="bottomheig" style={{paddingRight:0,paddingLeft:'17px'}}>
                        <div className="wappscol">
                            <div className="titleechart">
                                <span className="titlename">巡更次数</span>
                            </div>
                            <div className="comp">
                                <Echartline
                                    type="patrol"
                                    winhe={parseInt(this.state.DHeight)*0.3-70}
                                    patrolNumepg = { this.state.patrolNumepg }
                                    patrolNumqwl = { this.state.patrolNumqwl }
                                    dayly = { this.state.dayly }
                                    patroNameepg = { this.state.patroNameepg }
                                    patroNameqwl = { this.state.patroNameqwl }
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Datavisual;
