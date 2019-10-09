import React, { Component } from "react";
import { Row, Col } from "antd";
import "../../style/ztt/css/Companyhome.css";
import { post } from "../../axios/tools";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Equipment from "../userhome/Equipment";
import RollcallStatistics from "./RollcallStatistics";
import PatrolStatistics from "./PatrolStatistics";
//图标
import baojing from "../../style/ztt/img/baojing.png";
import cloud from "../../style/ztt/img/cloud.png";
import nopic from "../../style/imgs/nopic.png";
import nodata from "../../style/imgs/nodata.png";
import Scenedata from "./Scenedata";
// import { Map,Marker } from 'react-amap';

class Companyhome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activecompcode:
        props.auth && props.auth.active
          ? props.auth.active.activecompanycode
          : "", //当前查看的公司
      mapJson: [],
      enterpriseTitle: [],
      cloudDate: "",
      myEquipment: [],
      code: [],
      codeCamera: [],
      alarmcount: [],
      activelist: [], //共享设备
      passivelist: [], //查看我的用户
      scenegraph: "",
      echartsHeight: "250px"
    };
  }
  componentDidMount() {
    //巡更计划
    this.patrolresul();
    //点名统计
    this.rollcalldetail();
    //总览
    this.companyHome();
    this.setState({
      DHeight: document.documentElement.clientHeight - 65 + "px"
    });
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.auth.active.activecompanycode != nextState.activecompcode) {
      this.setState(
        {
          activecompcode: nextProps.auth.active.activecompanycode
        },
        () => {
          this.componentDidMount();
        }
      );
    }
    return true;
  };
  //总览
  companyHome = () => {
    post(
      {
        url: "/api/company/getone",
        data: { passivecode: this.state.activecompcode }
      },
      res => {
        if (res.success) {
          let mapJson = [
            {
              name: res.data.cname,
              value: [res.data.clng, res.data.clat]
            }
          ];
          this.setState(
            {
              activelist: res.activelist, //共享用户
              passivelist: res.passivelist, //查看我的用户
              enterpriseTitle: res.data.cname,
              myEquipment: res.camera,
              mapJson: mapJson,
              code: res.data.code,
              alarmcount: res.alarmcount,
              cloudDate: res.data.cloudvaliddate,
              scenegraph: res.data.scenegraph //场景图阿房宫http://api.aokecloud.cn/upload/scenegraph/1000020.json
            },
            () => {
              console.log("获取场景图地址信息", this.state.scenegraph);
            }
          );
        }
      }
    );
  };
  //巡更计划
  patrolresul = () => {
    post(
      {
        url: "/api/patrolresult/gets_patrol_weeks",
        data: { passivecode: this.state.activecompcode }
      },
      res => {
        if (res.success) {
          var patroList = Object.keys(res.data).map(key => res.data[key]);
          var patrolListX = patroList.map(v => v.pdate.substring(5)).reverse();
          var patrolCount = patroList.map(v => v.totalcount).reverse();
          var normal = patroList.map(v => v.normal).reverse();
          this.setState({
            patrolListX: patrolListX,
            patrolCount: patrolCount,
            normal: normal
          });
        }
      }
    );
  };
  //点名统计
  rollcalldetail = () => {
    post(
      {
        url: "/api/rollcalldetail/gets_rollcall_weeks",
        data: { passivecode: this.state.activecompcode }
      },
      res => {
        if (res.success) {
          var rollcall = Object.keys(res.data).map(key => res.data[key]);
          var rollcallX = rollcall.map(v => v.pdate.substring(5)).reverse();
          var rollcallCount = rollcall.map(v => v.totalcount).reverse();
          var rollcallNormal = rollcall.map(v => v.normal).reverse();
          this.setState({
            rollcallX: rollcallX,
            rollcallCount: rollcallCount,
            rollcallNormal: rollcallNormal
          });
        }
      }
    );
  };
  render() {
    return (
      <div className="Companyhome gutter-example button-demo">
        <div className="companyhome">
          <div className="boxHeight backBlock">
            <div
              className="backLitte boxShow "
              style={{ width: "50%", margin: "16px" }}
            >
              <div style={{ padding: "50px 10px", height: "100%" }}>
                {this.state.scenegraph ? (
                  <Scenedata
                    style={{ height: "100%" }}
                    type="maps"
                    cameracorrd={this.state.myEquipment}
                    scenegraph={this.state.scenegraph}
                    code={this.state.code}
                  />
                ) : (
                  <div style={{ margin: "30px auto", width: "200px" }}>
                    <img
                      src={nodata}
                      style={{ width: "100%", height: "160px" }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="topRightContext">
              <div id="alertHeight">
                <Row>
                  <Col xl={12} xxl={12}>
                    <div className="clear y-center marginTop littleLeft boxShow">
                      <Col span={8}>
                        <img src={baojing} alt="" className="noBorder" />
                      </Col>
                      <Col span={12} offset={1}>
                        <Row>
                          <Col span={24} className="blockFont adminFont">
                            {this.state.alarmcount}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="listContext blockNumber">
                            未处理报警数
                          </Col>
                        </Row>
                      </Col>
                    </div>
                  </Col>
                  <Col xl={12} xxl={12}>
                    <div className="clear y-center marginTop marginLeft boxShow">
                      <Col span={8}>
                        <img src={cloud} alt="" className="noBorder" />
                      </Col>
                      <Col span={12} offset={1}>
                        <Row>
                          <Col
                            span={24}
                            className="cloudFont adminFont blockFont listContext"
                            title={
                              this.state.cloudDate
                                ? this.state.cloudDate
                                : "无期限"
                            }
                          >
                            {this.state.cloudDate
                              ? this.state.cloudDate
                              : "无期限"}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="listContext blockNumber">
                            云服务到期日期
                          </Col>
                        </Row>
                      </Col>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="backLitte marginTop littleLeft">
                <p className="blockNumber echartsFont">巡更统计</p>
                <Col span={24}>
                  <PatrolStatistics
                    patrolListX={this.state.patrolListX}
                    patrolCount={this.state.patrolCount}
                    normal={this.state.normal}
                    echartsHeight={this.state.echartsHeight}
                  />
                </Col>
              </div>
              <div className="backLitte marginTop littleLeft marginBottom">
                <p className="blockNumber echartsFont">点名统计</p>
                <Col span={24}>
                  <RollcallStatistics
                    rollcallX={this.state.rollcallX}
                    rollcallCount={this.state.rollcallCount}
                    rollcallNormal={this.state.rollcallNormal}
                    echartsHeight={this.state.echartsHeight}
                  />
                </Col>
              </div>
            </div>
          </div>
        </div>
        <Row className="equipmentUser">
          <Col xl={24} xxl={24} className="marginTop marginLeft marginBottom">
            <div className="zonglanCircle" />
            &nbsp;&nbsp;<span className="titleFont">用户设备</span>
          </Col>
          <Equipment />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { auth } = state.httpData;
  return { auth };
};
export default withRouter(connect(mapStateToProps)(Companyhome));
