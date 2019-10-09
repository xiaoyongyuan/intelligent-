import React from "react";
import { Form, Icon, Input, Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchData, receiveData } from "@/action"; //action->index按需取
import { qrcode } from "../../axios/tools";
import QRCode from "qrcode.react";
import "../../style/jhy/css/login.css";
import "../../style/jhy/icon/iconfont.css";
import logopic from "../../style/jhy/imgs/logo.png";
import layerpic from "../../style/jhy/imgs/layer.png";
import layerpic2 from "../../style/jhy/imgs/layer2.png";
import layerpic3 from "../../style/jhy/imgs/layer3.png";
import snapline from "../../style/jhy/imgs/snapline.png";
import formborder from "../../style/jhy/imgs/formborder.png";

var count = 0;
let qrcodeSet = undefined; //控制二维码请求结果定时器

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeState: 0, //控制扫码登录和密码登录
      qrcodeStatus: 0, //控制二维码失效页面
      qrcode: "",
      loginTitle: "用户登录"
    };
  }
  componentWillMount() {
    const { receiveData } = this.props;
    receiveData(null, "auth");
  }
  componentDidUpdate(prevProps) {
    const { auth: nextAuth = {}, history } = this.props;
    if (nextAuth.data && nextAuth.data.success) {
      localStorage.setItem("token", nextAuth.data.token);
      localStorage.setItem("user", JSON.stringify(nextAuth.data.data));
      localStorage.setItem("comid", nextAuth.data.data.companycode);
      localStorage.setItem("account", nextAuth.data.data.account);
      if (nextAuth.data.data.ctype === "5") {
        history.push("/app/userhome/index");
      } else {
        if (nextAuth.data.data.activecount) history.push("/app/overView/index");
        else history.push("/app/companyhome/index");
      }
    }
  }
  //请求二维码
  handleQrcoderequest = () => {
    //60秒之后归零
    count = 0;
    qrcode({ url: "/login/get_qrcode" }, res => {
      if (res.success) {
        this.setState(
          {
            qrcode: res.qrcode,
            qrcodeStatus: 0
          },
          () => {
            this.hanleQrcode();
          }
        );
      }
    });
  };
  //二维码请求结果
  hanleQrcode = () => {
    qrcodeSet = setInterval(() => {
      qrcode(
        { url: "/login/qrcode_ret", data: { qrcode: this.state.qrcode } },
        res => {
          if (count < 60) {
            count++;
          } else if (count === 60) {
            clearInterval(qrcodeSet);
            this.setState({
              qrcodeStatus: 1
            });
          }
          if (res.success) {
            clearInterval(qrcodeSet);
            this.setState({
              account: res.ret.user,
              comid: res.ret.comid
            });
            if (this.state.user !== "" && this.state.comid !== "") {
              this.loginLast();
            }
          }
        }
      );
    }, 1000);
  };
  handlerImg = () => {
    if (this.state.typeState === 0) {
      //请求二维码
      this.handleQrcoderequest();
      this.setState({
        typeState: 1,
        loginTitle: "扫码登录"
      });
    } else if (this.state.typeState === 1) {
      clearInterval(qrcodeSet);
      this.setState({
        typeState: 0,
        loginTitle: "密码登录",
        qrcodeStatus: 0
      });
    }
  };
  //二维码登录
  loginLast = () => {
    let values = {
      account: this.state.account,
      comid: this.state.comid
    };
    const { fetchData } = this.props;
    fetchData({
      funcName: "webapp",
      url: "/login/verify_qrcode",
      params: values,
      stateName: "auth"
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //获取到的表单的值values
        const { fetchData } = this.props;
        fetchData({
          funcName: "webapp",
          url: "/login/verify",
          params: values,
          stateName: "auth"
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className="loginnew"
        style={{
            background:"#313653"
        }}
      >
        <div className="topbar">
          <div className="logo">
            <img src={logopic} alt="" />
            系统
          </div>
        </div>
        <div className="logcont ">
          <div className="wrapper clearfix">
            <div className="acrossturn clearfix">
              <div className="layerpic3">
                <img src={layerpic3} />
              </div>
              <div className="layerpic2">
                <img src={layerpic2} />
              </div>
              <div className="layerpic">
                <img src={layerpic} />
              </div>
              <div className="turntitle">
                <p>智能视频</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;联网预警</p>
              </div>
            </div>
            <div className="snapline">
              <img src={snapline} />
            </div>
            <div
              style={{
                background: `url('${formborder}')  no-repeat center/100% 100%`
              }}
              className="loginform clearfix"
            >
              <div className="login-top">
                <div className="login-title">{this.state.loginTitle}</div>
                <div
                  className={
                    "pwdBtn iconfont login-qrcode" +
                    (this.state.typeState ? " icon-diannao " : " icon-erweima")
                  }
                  onClick={this.handlerImg}
                />
              </div>
              <div className="qrcode">
                <div
                  className="codewrap"
                  style={{
                    display: this.state.typeState ? "block" : "none"
                  }}
                >
                  <QRCode
                    size={160}
                    value={this.state.qrcode}
                    className="QRCode"
                  />
                </div>
                <div
                  className="unefficacycodewrap"
                  style={{
                    display: this.state.qrcodeStatus ? "block" : "none"
                  }}
                >
                  <div className="unefficacycodewrap2">
                    <p className="unefficacy-title">二维码已失效</p>
                    <Button
                      className="freshcode"
                      onClick={this.handleQrcoderequest}
                    >
                      刷新二维码
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lgwrapper">
                <Form
                  onSubmit={this.handleSubmit}
                  className="lgform"
                  style={{
                    display: this.state.typeState ? "none" : "block"
                  }}
                >
                  <Form.Item>
                    {getFieldDecorator("account", {
                      rules: [
                        {
                          required: true,
                          message: "请输入用户名(手机号)!"
                        },
                        {
                          pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                          message: "请输入正确的手机号！"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{
                              color: "#5cadb9",
                              fontSize: 26,
                              marginRight: "10px"
                            }}
                          />
                        }
                        className="usersInput"
                        placeholder="请输入用户名"
                      />
                    )}
                  </Form.Item>
                  <Form.Item style={{ marginTop: "36px" }}>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "请输入密码!"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "#5cadb9", fontSize: 26 }}
                          />
                        }
                        type="password"
                        className="usersInput"
                        placeholder="请输入密码"
                        style={{ fontSize: "26px" }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{
                      textAlign: "center",
                      marginTop: "30px"
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="lgbutton"
                      style={{ width: "150px", height: "50px" }}
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">陕ICP备18019072号-1</div>
      </div>
    );
  }
}

const mapStateToPorps = state => {
  const { auth } = state.httpData;
  return { auth };
};

const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
  receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(
  mapStateToPorps,
  mapDispatchToProps
)(Form.create()(Login));
