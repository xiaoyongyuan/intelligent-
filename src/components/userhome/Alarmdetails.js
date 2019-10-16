import React from "react";
import { Button, Switch, Icon, message, Spin } from "antd";
import { post } from "../../axios/tools";
import "../../style/ztt/css/police.css";
const ButtonGroup = Button.Group;
let vis = false;
class Alarmdetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        //请求的数据
        src: "",
        name: "",
        tags: "",
        type: "1",
        atime: "",
        field: [],
        finalresult: []
      },
      detail: [],
      field: true, //是否显示围界信息
      obj: true, //是否显示报警对象
      prev: "", //上一条数据code
      next: "", //下一条数据code
      code: "", //当前数据的code
      videoopen: false, //视频开关
      loadding: true
    };
  }
  componentWillMount() {
    //此处拿到父页面参数
    this.setState(
      {
        faths: this.props.toson,
        code: this.props.toson.code,
        activecompcode: this.props.activecompcode,
        alarmType: this.props.toson.atype
      },
      () => {
        console.log(this.state.alarmType, "alarmType");
      }
    );
  }
  componentDidMount() {
    this.setState({
      loadding: true
    });
    post(
      {
        url: "/apiV1/alarminfo/getone_alarm",
        data: Object.assign(this.state.faths, {
            passivecode: this.state.activecompcode,
            webmark:1
        })
      },
      res => {
        let data = {
          src: res.data.picpath,
          field: res.data.field,
          name: res.data.name,
          alarmtype: res.data.alarmtype,
          finalresult: res.data.finalresult1,
          atime: res.data.atime,
          type: res.data.status,
          tags: res.data.tags,
          pic_width: res.data.pic_width, //报警宽
          pic_height: res.data.pic_height, //报警高
          videopath: res.data.videopath //视频地址
        };
        this.setState(
          {
            data: data,
            detail: res.detail,
            prev: res.data.last,
            next: res.data.next,
            ifdanger: res.data.ifdanger,
            videoopen: false,
            loadding: false
          },
          () => {
            this.draw();
            this.typetext();
          }
        );
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    //此处修改父页面参数
    if (nextProps.visible !== vis) {
      vis = nextProps.visible;
      if (nextProps.visible) {
        vis = nextProps.visible;
        this.setState(
          {
            code: nextProps.toson.code,
            faths: nextProps.toson,
            activecompcode: nextProps.activecompcode,
            alarmType: nextProps.toson.atype
          },
          () => {
            this.componentDidMount();
          }
        );
      }
    }
  }

  typetext = () => {
    //处理状态显示
    let text = "";
    let color = "";
    switch (this.state.data.type) {
      case 1:
        text = "确认";
        color = "#2A8E39";
        break;
      case 2:
        text = "忽略";
        color = "#00B5D0";
        break;
      case 3:
        text = "虚警";
        color = "#F22727 ";
        break;
      default:
        text = "未处理";
        color = "rgb(247, 195, 93)";
        break;
    }
    this.setState({
      typetext: text,
      color: color
    });
  };
  onChange = (checked, text) => {
    //控制显示围界与对象
    this.setState(
      {
        [text]: checked
      },
      () => {
        this.draw();
      }
    );
  };
  onChangeVideo = () => {
    // 查看视频切换
    this.setState({
      videoopen: !this.state.videoopen
    });
  };
  looknew = text => {
    //查看上下一条
    let faths = this.state.faths;
    faths.code = this.state[text];
    this.setState(
      {
        field: true,
        obj: true,
        faths: faths,
        code: this.state[text]
      },
      () => {
        this.componentDidMount();
      }
    );
  };
  draw = () => {
    //画围界
    let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0, 0, 704, 576); //清除之前的绘图
    area.lineWidth = 1;

    const datafield = this.state.data.field;
    if (this.state.field && datafield.length) {
      const xi = 604 / 704,
        yi = 476 / 576;
      let areafield = ele.getContext("2d");
      area.lineWidth = 1;
      areafield.strokeStyle = "#f00";
      datafield.map((el, i) => {
        areafield.beginPath();
        areafield.moveTo(
          parseInt(datafield[i][0][0] * xi),
          parseInt(datafield[i][0][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][1][0] * xi),
          parseInt(datafield[i][1][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][2][0] * xi),
          parseInt(datafield[i][2][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][3][0] * xi),
          parseInt(datafield[i][3][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][0][0] * xi),
          parseInt(datafield[i][0][1] * yi)
        );
        areafield.stroke();
        areafield.closePath();
        return "";
      });
    }
    const objs = this.state.data.finalresult;
    if (this.state.obj && objs.length) {
      //计算缩放比例
      const x = 604 / this.state.data.pic_width,
        y = 476 / this.state.data.pic_height;
      objs.map((el, i) => {
        area.strokeStyle = "#ff0";
        area.beginPath();
        area.rect(
          parseInt(el.x * x),
          parseInt(el.y * y),
          parseInt(el.w * x),
          parseInt(el.h * y)
        );
        area.stroke();
        area.closePath();
        return "";
      });
    }
  };
  alarmdeal = type => {
    //报警处理
    post(
      {
        url: "/api/alarm/update",
        data: { code: this.state.code, status: type }
      },
      res => {
        if (res) {
          let data = this.state.data;
          data.type = type;
          this.setState(
            {
              data: data
            },
            () => {
              this.typetext();
            }
          );
        }
      }
    );
  };
  delete = () => {
    //删除报警
    post(
      { url: "/api/alarm/update", data: { code: this.state.code, ifdel: 1 } },
      res => {
        if (res) {
          message.success("删除成功");
          let data = this.state.data;
          this.setState({ data }, () => {
            this.props.closeAlarm();
          });
        }
      }
    );
  };
  doCollection = () => {
    if (this.state.ifdanger === 1) {
      post(
        {
          url: "/api/alarm/update",
          data: { code: this.state.code, ifdanger: 0 }
        },
        res => {
          if (res.success) {
            message.success("已取消收藏 ");
            let data = this.state.data;
            this.setState({
              data,
              ifdanger: res.data[0].ifdanger
            });
          }
        }
      );
    } else if (this.state.ifdanger === 0) {
      post(
        {
          url: "/api/alarm/update",
          data: { code: this.state.code, ifdanger: 1 }
        },
        res => {
          if (res.success) {
            message.success(" 收藏成功");
            let data = this.state.data;
            this.setState({
              data: data,
              ifdanger: res.data[0].ifdanger
            });
          }
        }
      );
    }
  };
  handleImage(event, v) {
    function siblings(event) {
      var a = [];
      var p = event.nativeEvent.target.parentNode.children;
      for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== event.nativeEvent.target) a.push(p[i]);
      }
      return a;
    }
    event.nativeEvent.target.style.border = "1px solid #3792FF";
    siblings(event).forEach(it => {
      it.style.border = "none";
    });
    document.getElementById("canvasobj").style.backgroundImage = `url(${
      v.picpath
    })`;
    document.getElementById("alarmTime").innerHTML = v.atime;
    let ele = document.getElementById("canvasobj");
    let area = ele.getContext("2d");
    area.clearRect(0, 0, 604, 476); //清除之前的绘图
    area.lineWidth = 1;

    const datafield = v.field;
    if (this.state.field && datafield.length > 0) {
      const xi = 604 / 704,
        yi = 476 / 576;
      let areafield = ele.getContext("2d");
      area.lineWidth = 1;
      areafield.strokeStyle = "#f00";
      datafield.map((el, i) => {
        areafield.beginPath();
        areafield.moveTo(
          parseInt(datafield[i][0][0] * xi),
          parseInt(datafield[i][0][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][1][0] * xi),
          parseInt(datafield[i][1][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][2][0] * xi),
          parseInt(datafield[i][2][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][3][0] * xi),
          parseInt(datafield[i][3][1] * yi)
        );
        areafield.lineTo(
          parseInt(datafield[i][0][0] * xi),
          parseInt(datafield[i][0][1] * yi)
        );
        areafield.stroke();
        areafield.closePath();
        return "";
      });
    }
    const objs = v.finalresult1;
    if (this.state.obj && objs.length > 0) {
      //计算缩放比例
      const x = 604 / v.pic_width,
        y = 476 / v.pic_height;
      objs.map((el, i) => {
        area.strokeStyle = "#ff0";
        area.beginPath();
        area.rect(
          parseInt(el.x * x),
          parseInt(el.y * y),
          parseInt(el.w * x),
          parseInt(el.h * y)
        );
        area.stroke();
        area.closePath();
        return "";
      });
    }
  }
  render() {
    return (
      <div className="alarmDetails">
        <Spin
          size="large"
          spinning={this.state.loadding}
          tip="加载中..."
          className="loadding"
        >
          <div className="alarmflex">
            <div className="flexleft">
              <div className="picleft">
                <canvas
                  id="canvasobj"
                  width="604px"
                  height="476px"
                  style={{
                    backgroundImage: "url(" + this.state.data.src + ")",
                    backgroundSize: "100% 100%",
                    display: this.state.videoopen ? "none" : "block"
                  }}
                />
                <div
                  style={{
                    display: this.state.videoopen ? "block" : "none",
                    width: "604px",
                    height: "513px"
                  }}
                >
                  <video
                    src={this.state.data.videopath}
                    autoplay="autoplay"
                    controls="controls"
                    width="600px"
                  />
                </div>
              </div>
              <div className="mergeImage">
                {this.state.detail.length > 0
                  ? this.state.detail.map(v => (
                      <img
                        src={v.pic_min}
                        alt=""
                        key={v.code}
                        className="mergeItem"
                        onClick={event => this.handleImage(event, v)}
                      />
                    ))
                  : null}
              </div>
            </div>
            <div className="flexright">
              <h4>
                <b>{this.state.data.name}</b>
              </h4>
              <p>
                <label>
                  报警对象：<span>{this.state.data.tags}</span>
                </label>
              </p>
              <p>
                <label>
                  围界信息:{" "}
                  <Switch
                    size="small"
                    checked={this.state.field}
                    onChange={checked => this.onChange(checked, "field")}
                  />
                </label>
              </p>
              <p>
                <label>
                  报警信息:{" "}
                  <Switch
                    size="small"
                    checked={this.state.obj}
                    onChange={checked => this.onChange(checked, "obj")}
                  />
                </label>
              </p>
              <p>
                <label>
                  报警时间：<span id="alarmTime" className="fontAr">{this.state.data.atime}</span>
                </label>
              </p>
             {/* <p
                style={{
                  display: this.state.alarmType === 12 ? "none" : "block"
                }}
              >
                <label>处理结果：</label>
                <span style={{ color: this.state.color }}>
                  {this.state.typetext}
                </span>
              </p>*/}
              {/*{!this.state.activecompcode ? (
                <p
                  style={{
                    display: this.state.alarmType === 12 ? "none" : "block"
                  }}
                >
                  <label>处理类型：</label>
                  <Button
                    style={{
                      background: "#2A8E39",
                      color: "#fff",
                      outline: "none !import"
                    }}
                    onClick={() => this.alarmdeal(1)}
                  >
                    确认
                  </Button>
                  <Button
                    style={{ background: "#F22727", color: "#fff" }}
                    onClick={() => this.alarmdeal(3)}
                  >
                    虚警
                  </Button>
                  <Button
                    style={{ background: "#00B5D0", color: "#fff" }}
                    onClick={() => this.alarmdeal(2)}
                  >
                    忽略
                  </Button>
                </p>
              ) : (
                ""
              )}
              {!this.state.activecompcode ? (
                <p>
                  <label>报警处理：</label>
                  <Button
                    style={{ background: "#5063EE", color: "#fff" }}
                    onClick={() => this.doCollection()}
                  >
                    {this.state.ifdanger == 1 ? "取消收藏" : "收藏"}
                  </Button>
                  <Button
                    type="primary"
                    style={{ background: "#313653", color: "#fff" }}
                    onClick={() => this.delete()}
                  >
                    删除
                  </Button>
                </p>
              ) : (
                ""
              )}*/}
              <div style={{ marginTop: "5px" }}>
                <Button.Group>
                  <Button
                    type="primary"
                    onClick={() => this.looknew("prev")}
                    disabled={this.state.prev ? false : true}
                    style={{ marginRight: "-20px" }}
                  >
                    <Icon type="left" />
                    上一条
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.looknew("next")}
                    disabled={this.state.next ? false : true}
                  >
                    下一条
                    <Icon type="right" />
                  </Button>
                </Button.Group>
              </div>
              {this.state.data.videopath ? (
                <Button
                  type="primary"
                  onClick={() => this.onChangeVideo()}
                  style={{ marginTop: "10px" }}
                >
                  {this.state.videoopen ? "查看图片" : "查看视频"}
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
export default Alarmdetails;
