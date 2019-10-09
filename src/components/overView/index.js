import React, { Component } from 'react';
import {Row, Col, Carousel, Modal} from 'antd';
import '../../style/yal/css/overView.css';
import {post} from "../../axios/tools";
import Echartline from "./Echartline";
import nodata from "../../style/imgs/nodata.png";
import Echartmap from "./Echartmap";
import Universebg from "./Universebg";
import moment from "moment";

class overView extends Component {
    constructor(props){
        super(props);
        this.state= {
            option:{},
            analysisCount:0,//总报警数
            unhandle:0,//未处理报警数
            okconfirm:0,//确认数
            xufalse:0,//虚报警数
            ignore:0,//忽略数
            today:moment().format('LL'),
            rollArrX: [],//点名次数x轴
            rollName: [],//点名次数名称
            afang: [],
            ming: [],
            patrolX: [],//巡更
            patrolName: [],
            patrolafang:[],
            patrolafangafang:[],
            patrolafangming:[],
            deveicek:[],//设备
            callist:[],
            visible: false,
            visibleImg:false,
            visibleState:false,
            alarmVideo:[],
            carsalarm:{},//车报警数量
            fireCount:{},//火报警数量
            personalarm:{},//人报警数量
            name:"",
            value:Number,
            alarmnumber:{},
            mapJson:{},
            mapValue:[],
            cnameMap:"",
            tootilp:[],
        };
        this.saveRef = ref => {this.refDom = ref};
    }
    componentWillMount=()=>{
        this.setState({
            DHeight:document.documentElement.clientHeight-65+'px'
        })

    };
    //点击查看设备信息
    equipmentModel =(code)=>{
        post({url:"/api/camera/getone",data:{code:code}},(res)=>{
            if(res.success){
                for(var i in res.data.field){
                    var count=i;
                }
                this.setState({
                    visibleState:true,
                    equipmentCname:res.data.cname,
                    equipment:res.data.name,
                    lastHeartbeat:res.heartdata.time,
                    temperature:res.heartdata.temp,
                    location:res.data.location,
                    equsector:count,
                    picpath:res.data.picpath,
                    defence:res.data.work
                });
            }
        })
    };
    //设备状态model关闭
    VideoCancelState =()=>{
        this.setState({
            visibleState:false,
        })
    }
    //即时信息model打开
    informatinImg =(pathImg,cname,cameraname,type,time)=> {
        this.setState({
            visibleImg: true,
            pathImg: pathImg,
            cname:cname,
            cameraname:cameraname,
            type:type,
            time:time,
        })
    };
    VideoCancelImg =()=>{
        this.setState({
            visibleImg:false
        })
    };
    //即时视频model
    instantVideo =(pathImg)=>{
        this.setState({
            visible:true,
            pathImg:pathImg
        })
    };
    VideoCancel =()=>{
        this.setState({
            visible:false
        })
    };
    //报警分析
    alarmAnalysis =()=>{
        post({url:"/api/alarm/gets_radar_big"},(res)=>{
            if(res.success){
                var countalar=res.data.cars.value+res.data.fire.value+res.data.patrol.value+res.data.person.value+res.data.rollcall.value;
                this.setState({
                    cars:res.data.cars.value,
                    fire:res.data.fire.value,
                    patrol:res.data.patrol.value,
                    person:res.data.person.value,
                    rollcall:res.data.rollcall.value,
                    countalar:countalar,
                })
            }
        })
    };
    //位置图
    locationMap =()=>{
        post({url:"/api/company/getone_special"},(res)=>{
            if(res.success){
                var mapJson={},mapValue=[],tootilp=[];
                for(var a in res.lnglat) {
                    mapValue.push({code:res.lnglat[a].code,name:res.lnglat[a].name, value:res.lnglat[a].alarmcount});
                    var name=res.lnglat[a].name;
                    var value=res.lnglat[a].value;
                    mapJson[name]=value;
                    tootilp.push({name:res.lnglat[a].name,ecount:res.lnglat[a].ecount,alarmcount:res.lnglat[a].alarmcount});
                }
                this.setState({
                    cnameMap:res.data.cname,
                    mapJson:mapJson,
                    mapValue:mapValue,
                    tootilp:tootilp
                });
            }
        })
    };
    //报警视频
    alarmVideo =()=>{
        post({url:"/api/alarm/gets_alarm_video_big"},(res)=>{
            if(res.success){
                var videoList=Object.keys(res.data).map(key=> res.data[key]);
                this.setState({
                    alarmVideo:videoList.slice(0,3)
                })
            }
        })
    };
    //报警次数
    alarmList =()=>{
        post({url:"/api/alarm/gets_alarm_afterday_big"},(res)=>{
            if(res.success){
                var alarmX=[];
                var alarmName=[];
                var alarmafang=[];
                for(var a in res.data){
                    alarmName.push(res.data[a].cname);
                    for(var b in res.data[a].alarm){
                        alarmX.push(res.data[a].alarm[b].ahour);
                        alarmafang.push(res.data[a].alarm[b].alarmnum)
                    }
                }
                this.setState({
                    alarmX:alarmX.slice(0,24),
                    alarmName:alarmName,
                    alarmafang:alarmafang.slice(0,24),
                    alarmming:alarmafang.slice(24,48),
                });
            }
        })
    }
    //点名次数
    rollcalldetail =()=>{
        post({url:"/api/rollcalldetail/gets_rollcall_weeks_big"},(res)=>{
            if(res.success){
                var rollX=[];
                var rollName=[];
                var afang=[];
                for(var a in res.data){
                    rollName.push(res.data[a].cname);
                    for(var b in res.data[a].rollcall){
                        rollX.push(moment(res.data[a].rollcall[b].pdate).format("MM.DD"));
                        afang.push(res.data[a].rollcall[b].totalcount);
                    }
                }
                var fanle=[];
                fanle=afang.reverse();
                this.setState({
                    rollArrX:rollX.reverse().slice(0,7),
                    rollName:rollName,
                    afang:fanle.slice(7,14),
                    ming:fanle.slice(0,7),
                });
            }
        })
    };
    //巡更次数
    patrolresult =()=>{
        post({url:"/api/patrolresult/gets_patrol_weeks_big"},(res)=>{
            if(res.success){
                var patrolX=[];
                var patrolName=[];
                var patrolafang=[];
                for(var a in res.data){
                    patrolName.push(res.data[a].cname);
                    for(var b in res.data[a].patrol){
                        patrolX.push(moment(res.data[a].patrol[b].pdate).format("MM.DD"));
                        patrolafang.push(res.data[a].patrol[b].totalcount)
                    }
                }
                this.setState({
                    patrolX:patrolX.reverse().slice(0,7),
                    patrolName:patrolName,
                    patrolafangafang:patrolafang.reverse().slice(0,7),
                    patrolafangming:patrolafang.slice(7,14),
                });
            }
        })
    };

    dynamic =()=>{//设备近况
        var ScollOut=document.getElementById("ScollhiddenOut");
        var bl = 5;
       setInterval(
            document.getElementById("ScollhiddenOut").onscroll=function() {
                bl=bl+1.0;
                var scrollHeight = ScollOut.scrollHeight;//div里内容的高度
                var scrollTop =ScollOut.scrollTop;//0-18
                var clientHeight = ScollOut.clientHeight;//div内里框框的高度
                var scrollbottom=scrollHeight-clientHeight;
                var scrollTopP=Math.ceil(scrollTop);
              
                if(scrollbottom-scrollTopP<2) {//滚动到底部了
                    ScollOut.scrollTop=0;
                    bl=0;
                }else{
                    ScollOut.scrollTop = bl;
                }
            },6000);
    };
    deveicek =()=>{//设备近况
        post({url:"/api/camera/gets_camerainfo_big"},(res)=>{
            if(res.success){
                this.setState({
                    deveicek:res.data,
                    lasttime:res.data.lasttime,
                    hearttime:res.data.hearttime,
                })
            }
        })
    }
    cal=()=>{//即时信息轮播
        post({url:"/api/alarm/gets_info_big"},(res)=>{
            if(res.success){
                this.setState({
                    callist:res.data,
                })
            }
        })
    }
    alarmnumber=()=>{//报警数量
        post({url:"/api/alarm/gets_radar_big"},(res)=>{
            if(res.success){
                if(res.data.cars!=="" || res.data.fire!=="" || res.data.person!==""){
                    this.setState({
                        carsalarm:res.data.cars.value,
                        fireCount:res.data.fire.value,
                        personalarm:res.data.person.value,
                    })
                }
            }
        })
    };
    statework=()=>{ //布防转换
        if(this.state.defence===2){
            return "布防中";
        }else if(this.state.defence===1){
            return "不在布防中";
        }else{
            return "未设置";
        }
    }
    isonline=()=>{ //当前状态
        let time= this.state.lastHeartbeat;// 取到时间
        let yijingtime=new Date(time); //取到时间转换
        let timq=yijingtime.getTime(yijingtime) // 取到时间戳
        let myDate=new Date();// 当前时间
        let timc=myDate.getTime(myDate) // 当前时间戳
        if(time){
            if(timc-timq>60000){
                return "离线";
            }else{
                return "在线";
            }
        }
    };
    //设备状态
    heartHandle=(lastalarm,hearttime)=>{
      const days=new Date().getTime();//当前时间的时间戳
      const oldHear=new Date(hearttime).getTime();//心跳时间的时间戳
      const oldLast=new Date(hearttime).getTime();//最后一次时间的时间戳
      if(lastalarm&&lastalarm !='null' || hearttime){
          if((days-oldLast)>60000 || (days-oldHear)>60000){
              return "离线";
          }else{
              return "在线";
          }
      }
    };
    componentDidMount() {
        window.onresize = () => {
            this.setState({
                DHeight:document.documentElement.clientHeight-65+'px'
            })
        };
        //背景动态
        this.dynamic();
        //点名次数
        this.rollcalldetail();
        //巡更次数
        this.patrolresult();
        //报警次数
        this.alarmList();
        //设备近况
        setInterval(()=>this.timer(),60000);
        this.deveicek();
        //设备轮播
        this.cal();
        //报警视频
        this.alarmVideo();
        //位置图
        this.locationMap();
        //报警数量
        this.alarmnumber();
        //报警分析
        this.alarmAnalysis();
    }
    timer=()=>{
        this.deveicek();
        this.cal();
        this.alarmVideo();
    };
    render() {
        const _this=this;
        return (
            <div className="overView" style={{height:this.state.DHeight}}>
                <Universebg />
                <Row gutter={24} className="warrper" >
                    <Col span={7} className="wcolum">
                        <div className="clunm">
                            <div className="lump">
                                <div className="titleechart">
                                    <span className="titlename">报警分析</span>
                                </div>
                                <div className="comp callPolice">
                                    <div className="policeNumber">
                                        <div className="policeBox">
                                           <div className="policeTitle"><div className="person-police"></div><div className="police-font">人报警</div></div>
                                            <div className="policeBody"><span className="policeSum personColor">{this.state.person}</span><span>次</span></div>
                                        </div>
                                        <div className="policeBox">
                                            <div className="policeTitle"><div className="car-police"></div><div className="police-font">车报警</div></div>
                                            <div className="policeBody"><span className="policeSum carColor">{this.state.cars}</span><span>次</span></div>
                                        </div>
                                    </div>
                                    <div className="policeNumber">
                                        <div className="policeBox">
                                            <div className="policeTitle"><div className="patrol-police"></div><div className="police-font">巡更报警</div></div>
                                            <div className="policeBody"><span className="policeSum patrolColor">{this.state.patrol}</span><span>次</span></div>
                                        </div>
                                        <div className="policeBox">
                                            <div className="policeTitle"><div className="call-police"></div><div className="police-font">点名报警</div></div>
                                            <div className="policeBody"><span className="policeSum callColor">{this.state.rollcall}</span><span>次</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clunm lumpbott">
                            <div className="lump ">
                                <div className="titleechart">
                                    <span className="titlename">设备状态</span>
                                </div>
                                <div className="comp">
                                    <div className="equiptable">
                                        <div className="equipment equiphead">
                                            <Row className="lines">
                                                <Col className="gutter-row" xl={8}>
                                                    单位
                                                </Col>
                                                <Col className="gutter-row" xl={8}>
                                                    设备
                                                </Col>
                                                <Col className="gutter-row" xl={8}>
                                                    状态
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="scollhidden">
                                            <div className="scollhidden-out" id="ScollhiddenOut" >
                                                <div className="scollhidden-inner">
                                                    {this.state.deveicek.map((el,i)=>(
                                                        <div className="equipment equipbody" key={'row'+i} onClick={()=>this.equipmentModel(el.code)}>
                                                            <Row className="lines"  >
                                                                <Col className="gutter-row" xl={8}>
                                                                    {el.cname}
                                                                </Col>
                                                                <Col className="gutter-row" xl={6}>
                                                                    {el.name}
                                                                </Col>
                                                                <Col className="gutter-row" xl={8}>
                                                                    {this.heartHandle(el.lastalarm,el.herattime)}
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </Col>
                    <Col span={10} className="wcolumMap">
                        <div className="mainmap">
                            <div className="titleechart">
                                <span className="titlename">位置图</span>
                                <span className="today">当前日期:<span className="timeBig">{this.state.today}</span></span>
                            </div>
                        </div>
                        <div className="maps">
                            <Echartmap type="xianmap" winhe={(parseInt(this.state.DHeight)*0.7-10)*0.8-100}
                                                      mapJson={this.state.mapJson}
                                                      mapValue={this.state.mapValue}
                                                      tootilp={this.state.tootilp}
                                                      cnameMap={this.state.cnameMap}
                             />
                        </div>
                        <div className="draw">
                            <div className="untreated alarmtitle">
                                总报警数
                            </div>
                            <div className="alarmover " style={{width:'100%'}}>
                                <div className="alarmcarousel tol">
                                    {this.state.countalar<1000000? this.state.countalar: <span> {(this.state.countalar/1000000).toFixed(2)}<span style={{fontSize:'20PX'}}>&nbsp;百万</span></span>}
                                </div>

                            </div>
                        </div>
                    </Col>
                    <Col span={7} className="wcolum">
                        <div className="clunm">
                            <div className="lump">
                                <div className="titleechart timely">
                                    <span className="titlename">即时信息</span>
                                </div>
                                <div className="comp" style={{height:'calc(100% - 60px)'}}>
                                    {
                                        this.state.callist? <Carousel autoplay className="righttop">
                                            {this.state.callist.map((el,i)=>(
                                                <div key={el.code} className="carouselitem">
                                                    <div className="Rotation_chart" style={{height:(parseInt(this.state.DHeight)*0.7-20)*0.5-76}}>
                                                        <div style={{maxHeight:'calc(100% - 110px)'}} ><img src={el.picpath} alt="" style={{ cursor:"pointer"}} onClick={()=>this.informatinImg(el.picpath,el.cname,el.cameraname,el.type,el.time)} /></div>
                                                        <div className="redcolor">
                                                            <span> {el.cname}</span> ,<span>{el.cameraname}</span>,
                                                            <span>{el.type==="alarm"?"报警":""} </span>
                                                            <span>{el.type==="rollcall"?"点名报警":""}</span>
                                                            <span>{el.type==="patrol"?"巡更":""}</span>,
                                                            <span>{el.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Carousel>:<div className="instantInfor"><div className="instant"><img src={nodata} alt=""/></div></div>

                                                }
                                </div>
                            </div>
                        </div>
                        <div className="clunm lumpbott">
                            <div className="lump">
                                <div className="titleechart">
                                    <span className="titlename">巡更次数</span>
                                </div>
                                <div className="comp">
                                    <Echartline
                                        type="alarmnum"
                                        winhe={(parseInt(this.state.DHeight)*0.7-10)*0.5-10}
                                        patrolX={this.state.patrolX}
                                        patrolName={this.state.patrolName}
                                        patrolafangafang={this.state.patrolafangafang}
                                        patrolafangming={this.state.patrolafangming}
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
                                <span className="titlename">报警次数</span>
                            </div>
                            <div className="comp">
                                <Echartline
                                    type="rollcall"
                                    winhe={parseInt(this.state.DHeight)*0.3-70}
                                    alarmName={this.state.alarmName}
                                    alarmX={this.state.alarmX}
                                    alarmafang={this.state.alarmafang}
                                    alarmming={this.state.alarmming}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col span={10} className="bottomheig" style={{paddingRight:0}}>
                        <div className="wappscol">
                            <div className="titleechart">
                                <span className="titlename">即时视频</span>
                            </div>
                            <div className="comp compCount">
                                <div className="compCountVideo">
                                    {
                                        this.state.alarmVideo.map((v,i)=>(
                                            i<3
                                            ?<div className="compVideo" key={i} onClick={()=>this.instantVideo(v.videopath)}>
                                                <video src={v.videopath} autoplay="autoplay" loop="loop" />
                                            </div> 
                                            :''                                             
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={7} className="bottomheig" style={{paddingRight:0,paddingLeft:'17px'}}>
                        <div className="wappscol">
                            <div className="titleechart">
                                <span className="titlename">点名次数</span>
                            </div>
                            <div className="comp">
                                <Echartline
                                    type="patrol"
                                    winhe={parseInt(this.state.DHeight)*0.3-70}
                                    rollArrX={this.state.rollArrX}
                                    rollName={this.state.rollName}
                                    afang={this.state.afang}
                                    ming={this.state.ming}
                                    bowen={this.state.bowen}
                                />
                            </div>
                        </div>
                    </Col>
                    <Modal
                        width={900}
                        visible={this.state.visible}
                        onCancel={this.VideoCancel}
                        footer={null}
                        className="video"
                    >
                        <div className="shipin">
                            <div className="shipin-context">
                                <video src={this.state.pathImg} autoPlay="autoplay" controls="controls" loop="loop" style={{width:"100%",padding:"40px 0"}} />
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        width={900}
                        visible={this.state.visibleImg}
                        onCancel={this.VideoCancelImg}
                        footer={null}
                        className="video"
                    >
                        <div className="shipin">
                            <div className="shipin-contextImg">
                                <p>
                                    <span> {this.state.cname}</span> ,<span>{this.state.cameraname}</span>,
                                    <span>{this.state.type==="alarm"?"报警":""} </span>
                                    <span>{this.state.type==="rollcall"?"点名报警":""}</span>
                                    <span>{this.state.type==="patrol"?"巡更":""}</span>,
                                    <span>{this.state.time}</span>
                                </p>
                                <img src={this.state.pathImg} alt="" />
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        width={450}
                        visible={this.state.visibleState}
                        onCancel={this.VideoCancelState}
                        footer={null}
                        className="equipment"
                    >
                        <div className="shipin">
                            <div className="shipin-context">
                                <div className="equipmentModel">
                                    <p>单位：{this.state.equipmentCname}</p>
                                    <p>设备：{this.state.equipment}</p>
                                    <p>状态： {this.isonline()}</p>
                                    <p>所在位置：{this.state.location} </p>
                                    <p>型号：S01 </p>
                                    <p>有效防区：{this.state.equsector}个 </p>
                                    <p>当前布防： {this.statework()} </p>
                                    <p>上次心跳：{this.state.lastHeartbeat} </p>
                                    <p>设备温度：{this.state.temperature}℃ </p>
                                    <div className="alarmImg"><span className="imgEqu">最后报警图片：</span>
                                        {this.state.picpath?<span className="picpath"><img src={this.state.picpath} alt=""/></span>:"无"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </Row>
            </div>
        )
    }
}
export default overView;
