import React, { Component } from "react";
import "../../style/jhy/css/defendarea.css";
class Sechild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topLeftPoint: [0, 0],
      topRightPoint: [200, 0],
      bottLeftPoint: [0, 200],
      bottRightPoint: [200, 200],
      width: 200,
      height: 200
    };
  }
  componentDidMount() {
    window.Sechild = this;
    function $(id) {
      return document.getElementById(id);
    }

    function getEvent(e) {
      return e || window.event;
    }

    function getLocation(e) {
      return {
        x: e.x || e.clientX,
        y: e.y || e.clientY
      };
    }
    var obj = null; // 当前操作的对象
    var preview = null; // 要处理的对象
    var clickX = 0; // 保留上次的X轴位置
    var clickY = 0; // 保留上次的Y轴位置
    var preLeft = 0; //保留处理对象的坐标
    var preTop = 0; //保留处理对象的坐标
    preview = $("preview");
    var comstyle = window.getComputedStyle(preview);

    window.Sechild.setState(
      {
        topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
        topRightPoint: [
          parseInt(comstyle.left) + parseInt(comstyle.width),
          parseInt(comstyle.top)
        ],
        bottLeftPoint: [
          parseInt(comstyle.left),
          parseInt(comstyle.top) + parseInt(comstyle.height)
        ],
        bottRightPoint: [
          parseInt(comstyle.left) + parseInt(comstyle.width),
          parseInt(comstyle.top) + parseInt(comstyle.height)
        ],
        width: 200,
        height: 200
      },
      () => {}
    );
    // 鼠标点击
    var onDragDown = function(e, type, _this) {
      e = getEvent(e);
      var location = getLocation(e);
      clickY = location.y;
      clickX = location.x;
      preview = $("preview");
      preLeft = preview.offsetLeft;
      preTop = preview.offsetTop;

      obj = _this;
      obj.operateType = type;
      return false;
    };
    var onUpBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "n", _this);
    };
    var onDownBtnDown = function(e) {
      var _this = this;
      onDragDown(e, "s", _this);
    };
    var onCenterLeftBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "w", _this);
    };
    var onCenterRightBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "e", _this);
    };
    var onUpLeftBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "nw", _this);
    };
    var onUpRightBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "ne", _this);
    };
    var onDownLeftBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "sw", _this);
    };
    var onDownRightBtnDown = function(e) {
      var _this = this;

      onDragDown(e, "se", _this);
    };
    var onCenterContextDown = function(e) {
      var _this = this;
      onDragDown(e, "move", _this);
    };
    var onDragUp = function() {
      document.body.style.cursor = "auto";
      obj = null;
    };
    var move = function(operateType, location, preview) {
      document.body.style.cursor = operateType + "_resize";
      const comstyle = window.getComputedStyle(preview);
      switch (operateType) {
        case "e":
          var add_length = location.x - clickX;
          clickX = location.x;
          var length = parseInt(preview.style.width) + add_length;
          if (
            parseInt(preview.style.width) + parseInt(preview.offsetLeft) <=
            704
          ) {
            preview.style.width = length + "px";
          } else {
            onDragUp();
            preview.style.width = 704 - parseInt(preview.offsetLeft) + "px";
            preview.style.left = 704 - parseInt(preview.style.width) + "px";
          }
          window.Sechild.setState(
            {
              topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
              topRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top)
              ],
              bottLeftPoint: [
                parseInt(comstyle.left),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              bottRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              width: parseInt(comstyle.width),
              height: parseInt(comstyle.height)
            },
            () => {}
          );
          break;
        case "s":
          var add_length = location.y - clickY;
          clickY = location.y;
          var length = parseInt(preview.style.height) + add_length;
          if (
            parseInt(preview.style.height) + parseInt(preview.offsetTop) <=
            576
          ) {
            preview.style.height = length + "px";
          } else {
            onDragUp();
            preview.style.top = 576 - parseInt(preview.style.height) + "px";
            preview.style.height = 576 - parseInt(preview.offsetTop) + "px";
          }
          window.Sechild.setState(
            {
              topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
              topRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top)
              ],
              bottLeftPoint: [
                parseInt(comstyle.left),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              bottRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              width: parseInt(comstyle.width),
              height: parseInt(comstyle.height)
            },
            () => {}
          );
          break;
        case "w":
          var add_length = location.x - clickX;
          clickX = location.x;
          var length = parseInt(preview.style.width) - add_length;
          if (parseInt(preview.offsetLeft) > 0) {
            preview.style.width = length + "px";
            preview.style.left = add_length + preview.offsetLeft + "px";
          } else {
            preview.style.left = 0;
            onDragUp();
          }
          if (parseInt(preview.style.width) < 50) {
            onDragUp();
          }
          window.Sechild.setState(
            {
              topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
              topRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top)
              ],
              bottLeftPoint: [
                parseInt(comstyle.left),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              bottRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              width: parseInt(comstyle.width),
              height: parseInt(comstyle.height)
            },
            () => {}
          );
          break;
        case "n":
          var add_length = location.y - clickY;
          clickY = location.y;
          var length = parseInt(preview.style.height) - add_length;
          if (parseInt(preview.offsetTop) > 0) {
            preview.style.height = length + "px";
            preview.style.top = add_length + preview.offsetTop + "px";
          } else {
            preview.style.top = 0;
            onDragUp();
          }
          if (parseInt(preview.style.height) < 50) {
            onDragUp();
          }
          window.Sechild.setState(
            {
              topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
              topRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top)
              ],
              bottLeftPoint: [
                parseInt(comstyle.left),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              bottRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              width: parseInt(comstyle.width),
              height: parseInt(comstyle.height)
            },
            () => {}
          );
          break;
        case "move":
          var add_lengthX = location.x - clickX; //鼠标移动的距离
          var add_lengthY = location.y - clickY;
          var preDistanceX = add_lengthX + preLeft;
          var preDistanceY = add_lengthY + preTop;
          preview.style.top = preDistanceY + "px";
          preview.style.left = preDistanceX + "px";
          var comput = getComputedStyle(preview);
          if (preview.offsetTop < 0) {
            preview.style.top = 0;
          }
          if (preview.offsetLeft < 0) {
            preview.style.left = 0;
          }
          var totalw = parseInt(preview.offsetLeft) + parseInt(comput.width);
          var totalh = parseInt(preview.offsetTop) + parseInt(comput.height);
          if (totalw > 704) {
            var finalleft = 704 - parseInt(comput.width);
            preview.style.left = `${finalleft}px`;
          }
          if (totalh > 576) {
            var finaltop = 576 - parseInt(comput.height);
            preview.style.top = `${finaltop}px`;
          }
          window.Sechild.setState(
            {
              topLeftPoint: [parseInt(comstyle.left), parseInt(comstyle.top)],
              topRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top)
              ],
              bottLeftPoint: [
                parseInt(comstyle.left),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              bottRightPoint: [
                parseInt(comstyle.left) + parseInt(comstyle.width),
                parseInt(comstyle.top) + parseInt(comstyle.height)
              ],
              width: parseInt(comstyle.width),
              height: parseInt(comstyle.height)
            },
            () => {}
          );
          break;
        default:
          return;
      }
    };
    var onDragMove = function(e) {
      if (obj) {
        e = getEvent(e);
        var location = getLocation(e);
        preview = $("preview");

        switch (obj.operateType) {
          case "n":
            move("n", location, preview);
            break;
          case "s":
            move("s", location, preview);
            break;
          case "w":
            move("w", location, preview);
            break;
          case "e":
            move("e", location, preview);
            break;
          case "nw":
            move("n", location, preview);
            move("w", location, preview);
            break;
          case "ne":
            move("n", location, preview);
            move("e", location, preview);
            break;
          case "sw":
            move("s", location, preview);
            move("w", location, preview);
            break;
          case "se":
            move("s", location, preview);
            move("e", location, preview);
            break;
          case "move":
            move("move", location, preview);
            break;
          default:
        }
      }
      return false;
    };
    $("upBtn").onmousedown = onUpBtnDown;
    $("downBtn").onmousedown = onDownBtnDown;
    $("centerLeftBtn").onmousedown = onCenterLeftBtnDown;
    $("centerRightBtn").onmousedown = onCenterRightBtnDown;
    $("upLeftBtn").onmousedown = onUpLeftBtnDown;
    $("upRightBtn").onmousedown = onUpRightBtnDown;
    $("downLeftBtn").onmousedown = onDownLeftBtnDown;
    $("downRightBtn").onmousedown = onDownRightBtnDown;
    $("centerContext").onmousedown = onCenterContextDown;

    document.onmousemove = onDragMove;
    document.onmouseup = onDragUp;
  }

  render() {
    const bordcolor = this.props.color ? this.props.color : "green";
    const defleft = this.props.left ? this.props.left + "px" : "200px";
    const deftop = this.props.top ? this.props.top + "px" : "100px";
    const defwidth = this.props.width ? this.props.width + "px" : "200px";
    const defheight = this.props.height ? this.props.height + "px" : "200px";
    return (
      <div
        id="preview"
        className="preview"
        style={{
          background: "transprent",
          width: defwidth,
          height: defheight,
          border: `1px solid ${bordcolor}`,
          position: "absolute",
          left: defleft,
          top: deftop,
          zIndex: "1000",
          minWidth: "50px",
          minHeight: "50px",
          boxSizing: "border-box"
        }}
      >
        <div className="upBtn" id="upBtn" />
        <div className="downBtn" id="downBtn" />
        <div className="upLeftBtn" id="upLeftBtn" />
        <div className="upRightBtn" id="upRightBtn" />
        <div className="downLeftBtn" id="downLeftBtn" />
        <div className="downRightBtn" id="downRightBtn" />
        <div className="centerLeftBtn" id="centerLeftBtn" />
        <div className="centerRightBtn" id="centerRightBtn" />
        <div className="centerContext" id="centerContext" />
      </div>
    );
  }
}
export default Sechild;
