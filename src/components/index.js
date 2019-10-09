/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from "react-loadable";
import Loading from "./widget/Loading";

//大数据
import Datavisual from "./companyhome/visual";
import Overview from "./overView/index";

//企业用户
import Companyhome from "./companyhome/Companyhome";
import Companyscene from "./companyhome/Companyscene";
import Companydeveice from "./companyhome/Companydeveice";
import Calling from "./companyhome/Calling";
import Connent from "./companyhome/Connent";
import Deveicedet from "./companyhome/Deveicedet";
import Setarea from "./companyhome/Setarea";
import Settime from "./companyhome/Settime";

// 个人用户
import Alarmdetails from "./userhome/Alarmdetails";
import Alarmlist from "./userhome/Alarmlist";
import Equipment from "./userhome/Equipment";
import Userhome from "./userhome/Userhome";
import Userdeveice from "./userhome/Userdeveice"; //设备信息

//系统管理
import Loglist from "./settings/Loglist";
import Employeelist from "./settings/Employeelist";
import objShow from "./settings/objShow"; //报警对象展示，测试页面
import Messages from "./settings/Messages";

//巡更
import PatrolPlan from "./patrol/PatrolPlan";
import PatrolRecord from "./patrol/PatrolRecord";
import PatrollHostory from "./patrol/PatrolHostory";

//点名
import RollcallTask from "./rollcall/RollcallTask";
import RollcallRecord from "./rollcall/RollcallRecord";
import Adopt from "./rollcall/Adopt";
import Auditing from "./rollcall/Auditing";
import RollcallHostory from "./rollcall/RollcallHostory";
import AdoptLook from "./rollcall/AdoptLook";

//直播
import Live from "./live/index";

const WysiwygBundle = Loadable({
  // 按需加载富文本配置
  loader: () => import("./ui/Wysiwyg"),
  loading: Loading
});

export default {
  Datavisual,
  Overview,
  WysiwygBundle,
  Companyhome,
  Companyscene,
  Companydeveice,
  Calling,
  Connent,
  Deveicedet,
  Settime,
  Setarea,
  Alarmdetails,
  Alarmlist,
  Equipment,
  Userhome,
  Userdeveice,
  Employeelist,
  Loglist,
  PatrolPlan,
  PatrolRecord,
  PatrollHostory,
  RollcallTask,
  RollcallRecord,
  Adopt,
  Auditing,
  RollcallHostory,
  AdoptLook,
  Live,
  objShow,
  Messages
};
