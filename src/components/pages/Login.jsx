import React from "react";
import { Form, Icon, Input, Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchData, receiveData } from "@/action"; //action->index按需取
import { qrcode } from "../../axios/tools";
import QRCode from "qrcode.react";
import "../../style/jhy/css/login.css";
import "../../style/jhy/icon/iconfont.css";
import erweima from "../../style/cby/img/login/erweima.png";
import post1 from "../../style/cby/img/login/posit1.png";
import post2 from "../../style/cby/img/login/posit2.png";
import post3 from "../../style/cby/img/login/posit3.png";
import post4 from "../../style/cby/img/login/posit4.png";
import passworlogo from "../../style/cby/img/login/passworlogo.png";
import userlogo from "../../style/cby/img/login/userlogo.png";
import userlogin from "../../style/cby/img/login/userlogin.png";


var count = 0;
let qrcodeSet = undefined; //控制二维码请求结果定时器

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeState: 0, //控制扫码登录和密码登录
      qrcodeStatus: 0, //控制二维码失效页面
      qrcode: "",
      loginTitle: "用户登录" ,
      paseeey: ["password", "eye-invisible", "#313A62", "0.3"]
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
    this.props.form.setFieldsValue({
      account : "" ,
     password : ""

    })

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

  eyepas = e =>{
    let arr1 = ["text", "eye", "#1E73FF", "1"]
    let arr2 = ["password" , "eye-invisible", "#313A62", "0.3"]
    // paseeey: ["password", "eye", "#1E73FF", "1"]
    if (this.state.paseeey[0] == "password"){
      this.setState({
        paseeey: arr1
      });
    }else{
      this.setState({
        paseeey: arr2
      });
    }
  }
  
  render() {
    let tetarr = [["瞬间响应，快人一步", "视频联网报警应急系统"],
      ["警情预判，零误报！", "小时人机结合"],
    ["多样报警处理，全局联动！", "通用型，无人值守智能安防平台"],
    ["用户隐私，警用级加密！", "无忧隐私保护计划"],
      ["瞬间响应，快人一步", "视频联网报警应急系统"]
    ]
    let sspa = ["AI", "7X24", 0, 0, "AI"]
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className="loginnew"
      >
        {/* <img src={post1} alt="" className="posi1" />
        <img src={post2} alt="" className="posi2" />
        <img src={post3} alt="" className="posi3" />
        <img src={post4} alt="" className="posi4"/> */}
        <div className="tetsssBox">
          <div className="tetsbbo">
            
            {tetarr.map((a, b) => (
              <div className={`tetsss `} key={"tetsss" + b}
                style={{ left:`${600*b}px` }}
              >
                <p>{a[0]}</p>
                <p>{sspa[b] ? <span className="fontAr">{sspa[b]}</span> : ""} {a[1]}</p>
              </div>
              )
            )}
          </div>
        </div>
        <div className="topbar">
          <div className="logo">
            {/* <img src={logopic} alt="" /> */}
            傲智 <span className="fontAr">AI</span> 视频警戒系统
          </div>
        </div>
        <div className="logcont ">
          <div className="clearfix">
            <div
              className="loginform clearfix"
            >
              <div className="login-top clearfix">
                {/* //用户登录 */}
                <div className="login-title fl">{this.state.loginTitle}</div>
                <div
                  className={
                    "rg " 
                    // "rg pwdBtn iconfont login-qrcode" +
                    // (this.state.typeState ? " icon-diannao " : " icon-erweima")
                  }
                  
                  onClick={this.handlerImg}
                > <img src={this.state.typeState ? userlogin : erweima} alt=""/>
                   </div> 
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
                          // <Icon
                          //   type="user"
                          //   style={{
                          //     color: "#1E73FF",
                          //     fontSize: 26,
                          //     marginRight: "10px"
                          //   }}
                          // />
                          <img src={userlogo} alt=""/>
                        }
                        autocomplete="off"
                        className="usersInput"
                        placeholder="请输入用户名"
                        style={{ fontSize: "20px", color: "#313A62", fontFamily: "Ariai"}}
                  />
                )}
                  </Form.Item>
                  <Form.Item style={{ marginTop: "40px" }}>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "请输入密码!"
                        },
                        {
                          max: 15,
                          message: "密码最大长度不得超过15！"
                        },
                        {
                          min: 6,
                          message: "密码最少长度不得低于6！"
                        }
                      ]
                    })(
                      <Input
                        prefix={
  //                         <Icon
  //                           type="lock"
  //                           style={{ color: "#1E73FF", fontSize: 26 }}
                            
  // />
                          <img src={passworlogo} alt="" />
}
suffix={
  <Icon type={this.state.paseeey[1]} style={{ color: this.state.paseeey[2], opacity: this.state.paseeey[3] }} onClick= {this.eyepas} />
}
// #1E73FF  #313A62 .3
type={this.state.paseeey[0]}
className="usersInput"
placeholder="请输入密码"
                        style={{ fontSize: "20px", color: "#313A62", fontFamily: "Ariai" }}
                  />
                )}
                  </Form.Item>
                  <Form.Item
                    style={{
                      textAlign: "center",
                      marginTop: "100px",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", height: "50px", background: "#1E73FF" ,
                        color: "#fff", fontSize: "20px", boxShadow:"0px 2px 10px rgba(30,115,255,0.2)",
                  borderRadius:"4px" }}
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
