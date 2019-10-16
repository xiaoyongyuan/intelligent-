import React, {Fragment} from 'react';
import {Form, Row, Col,Card, Button,Icon, message, Modal, Input} from 'antd';
import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
import CascaderModule from '../common/CascaderModule';

class Userdeveice extends React.Component{
    constructor(props){
        super(props);
        this.state={
            code:"",
            data:{},
            edata:{},
            login:{},
            heartdata:{},
            workingtime:[],
            visible:false,//弹窗
            changelat:'',//修改的纬度
            changelng:'',//修改的经度
            camerauser:'', //用户名
            camerapasswd:'', //密码
            portvalue:"", //端口号
            ipvalue:"", //设备IP
            subBtn:true,//提交按钮
        };
    }
    componentDidMount() {
        //取数据
        this.requestdata()
    }
    requestdata=(params) => {//取数据
        post({url:"/api/camera/getone",data:{code:this.props.query.id}}, (res)=>{
            if(res.success){
                this.setState({
                    changelng:res.data.lng,
                    changelat:res.data.lat,
                    lng:res.data.lng,
                    lat:res.data.lat,
                    data:res.data,
                    edata:res.edata,
                    login:res.login,
                    heartdata:res.heartdata,
                    workingtime:res.workingtime,
                    ipvalue:res.edata.cameraip,
                    portvalue:res.edata.cameraportno,
                    camerauser:res.edata.camerauser,
                    camerapasswd:res.edata.camerapasswd,
                    code1:this.props.query.id
                })
            }
        })
    }
    onChangeip=(e)=> {//ip  input 修改ip
        this.setState({
            ipvalue:e.target.value,
            subBtn:false
        });
    }
    onChangeport=(e)=> {//ip  input 修改
        this.setState({
            portvalue:e.target.value,
            subBtn:false
        });
    }
    onChangeuser=(e)=> {//user  input 修改
        this.setState({
            camerauser:e.target.value,
            subBtn:false
        });
    }
    onChangepwd=(e)=> {//pwd  input 修改
        this.setState({
            camerapasswd:e.target.value,
            subBtn:false
        });
    }

    updata = () => {//提交
        let data={
            code:this.props.query.id,
            ip:this.state.ipvalue,
            ausername:this.state.camerauser,
            authport:this.state.portvalue,
            apassword:this.state.camerapasswd,
            webreset:1
        };
        if(!data.ip||!data.ausername||!data.authport||!data.apassword){
            message.warn('请填写完整！');
            return;
        }
            post({url:"/api/camera/camerareset",data:data},(res)=>{
                if(res.success){
                    message.success("编辑成功！")
                }
            })
    }

    field=()=>{ //布防区域的个数
        var jsonData;
        if(this.state.data.field ===""){
             jsonData=0;
        }else{
             jsonData= this.state.data.field
        }
        var count = 0;
        for(var j in jsonData){
          count++;
        }
         return count;
    }
    status=()=>{ //报警类型
        if(this.state.heartdata.status==="stop"){
            return "停止运行"
        }else if(this.state.heartdata.status==="run"){
            return "运行中";
        }else{
            return "摄像头未连接";
        }
     }
     atype=()=>{ //报警类型
        switch(this.state.data.atype){
            case 1:
             return "入侵报警";
            case 110:
              return '匪警';
            case 119:
              return '火警';
            case 12:
              return '整点打卡';
            default:
             return '未知类型 '+this.state.data.atype;

        }
        if(this.state.data.atype===1){
            return
        }
    }
    isonline=()=>{ //当前状态
        let time= this.state.heartdata.time;// 取到时间
        let yijingtime=new Date(time); //取到时间转换
        let timq=yijingtime.getTime(yijingtime) // 取到时间戳
        let myDate=new Date();// 当前时间
        let timc=myDate.getTime(myDate) // 当前时间戳
        if(time){
            if(timc-timq>60000){
                return "离线";
            }else{
                return(<span className="oncolor">在线</span>)
            }
        }
    }
    tempbg=()=>{ //设备温度
        if(this.state.heartdata.temp<55){
            return 'oncolor fontAr';
        }else{
            return 'reecolor fontAr';
        }
    }
    isheart=()=>{ //是否1分钟内心跳
        if(this.state.heartdata.time){
            let time= this.state.heartdata.time.toString();// 取到时间
            let yijingtime=new Date(time); //取到时间转换
            let timq=yijingtime.getTime(yijingtime) // 取到时间戳
            let myDate=new Date();// 当前时间
            let timc=myDate.getTime(myDate) // 当前时间戳
            if(timc-timq>60000){
                return 'reecolor fontAr';
            }else{
                return 'oncolor fontAr';
            }
        }else{
            return 'reecolor';
        }
    }
    locationedit=()=>{
        this.setState({
            visible:true,
        });
    }
    changeCoord(e,coord){ //修改经纬度
        this.setState({
            [coord]:e.target.value,
        });
    }
    modalOk=()=>{ //修改坐标提交
        if(!this.state.changelat || !this.state.changelng ) return;
        const reg =/^\d+(\.\d+)?$/;
        if ( reg.test(this.state.changelat)&&reg.test(this.state.changelng) ) {
            post({url:"/api/camera/update",data:{code:this.props.query.id,lat:this.state.changelat,lng:this.state.changelng}}, (res)=>{
                if(res.success){
                    this.setState({
                        lat:this.state.changelat,
                        lng:this.state.changelng,
                        visible:false
                    },()=>{
                            message.success('修改成功！');
                    })
                }
            })
        }else{
            message.error('只能输入整数或者小数');
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    setstateComm=(label,value=true)=>{
        this.setState({
            [label]:value
        })
    }
    addreditOk=()=>{
        const va= this.child.formref()
        if(!va.zonecode || !this.state.addrdetail) return message.error('请填写完整！');
        post({url:"/api/camera/update",data:{code:this.props.query.id,location:va.zonename+','+this.state.addrdetail,village_id:va.zonecode}}, (res)=>{
            if(res.success){
                var statedata=this.state.data;
                statedata.village_id=va.zonecode;
                statedata.location=va.zonename+','+this.state.addrdetail;
                this.setState({
                    data:statedata,
                    addrdetail:'',
                    addreditSwitch:false
                },()=>{
                    message.success('修改成功！');
                })
            }
        })
    }
    addreditCancel=()=>{
        this.setState({
            addreditSwitch:false,
            addrdetail:''
        })

    }
    onRef = (ref) => {
      this.child = ref
    }
    render(){
        const _this=this;
        return(
            <div className="userdeveice">
                <div className="equim">
                    <div className="equim1">
                        <div className="zcard">
                            <div className="zCard-title">
                                <span>设备信息</span>
                                <span className="zline"/>
                            </div>
                            <div className="zcardBody">
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        {this.state.data.eid}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        报警类型：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        {this.atype()}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        所在位置：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l over" title={this.state.data.location}>
                                        {this.state.data.location}
                                    </Col>
                                    <Col span={2} offset={2}>
                                        <span onClick={()=>this.setstateComm('addreditSwitch')} style={{color:'#5063ee',cursor:'pointer'}} className="zuserdevice"/>
                                    </Col>
                                </Row>
                                <Row className="equ_row ">
                                    <Col span={6} className="t_r">
                                        坐标：
                                    </Col>
                                    <Col span={6} offset={1} className="t_l fontAr">
                                        经度：{this.state.lng}&nbsp;&nbsp;,纬度：{this.state.lat}
                                    </Col>
                                    <Col span={2} offset={1}>
                                        <span onClick={this.locationedit} style={{color:'#5063ee',cursor:'pointer'}} className="zuserdevice" />
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        最后报警时间：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l fontAr">
                                        {this.state.data.atime}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        防区设置：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <a  href={"#/app/companyhome/setarea?id="+_this.props.query.id+"&eid="+_this.props.query.eid} className="underline fontAr">
                                            {this.field()}个
                                        </a>
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设防时间：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <a href={"#/app/companyhome/settime?id="+_this.props.query.id} className="underline fontAr">
                                            {this.state.workingtime.length}段
                                        </a>
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        上次心跳：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l ">
                                        <span className="reecolor">{this.state.heartdata.time}</span>
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备温度：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <span className="oncolor"> {this.state.heartdata.temp}℃ </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="zcard1">
                            <div className="zCard-title">
                                <span>摄像头信息</span>
                                <span className="zline"/>
                            </div>
                            <div className="zcardBody">
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备状态：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        {this.status()}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备软件版本：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l fontAr">
                                        {this.state.login.version?this.state.login.version:'**'}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r fontAr">
                                        设备硬件版本：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        {this.state.login.version?this.state.login.version:'**'}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        当前状态：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        {this.isonline()}
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        用户名：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <input className="padd_left fontAr" type="text" value={this.state.camerauser} id="ip"
                                               onChange={(event)=>this.onChangeuser(event)}
                                        />
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        密码：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <input className="padd_left fontAr" type="text" value={this.state.camerapasswd}
                                               onChange={(e)=>this.onChangepwd(e)}
                                               id="port"
                                        />
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备IP：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <input className="padd_left fontAr" type="text"value={this.state.ipvalue} id="ip"
                                               onChange={(e)=>this.onChangeip(e)}
                                        />
                                    </Col>
                                </Row>
                                <Row className="equ_row">
                                    <Col span={6} className="t_r">
                                        设备端口：
                                    </Col>
                                    <Col span={12} offset={1} className="t_l">
                                        <input className="padd_left fontAr" type="text" value={this.state.portvalue} id="port"
                                               onChange={(e)=>this.onChangeport(e)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <Row className="equ_row">
                        <Col span={3} offset={20} className="t_l">
                            <Button type="primary" className=" lg" onClick={this.updata} disabled={this.state.subBtn?true:false}> 提交 </Button>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title={[
                        <div className="zuserdeModel">
                            <span className="zModelBlock"/>
                            <span className="zmodelFont">修改</span>
                        </div>
                    ]}
                    visible={this.state.visible}
                    onOk={this.modalOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Fragment>
                        <Row style={{marginTop:"20px"}}>
                            <Col span={3}><label>经度：</label></Col>
                            <Col span={12}>
                                <Input defaultValue={this.state.changelng} onChange={(e)=>this.changeCoord(e,'changelng')} />
                            </Col>
                        </Row>
                        <Row style={{margin:"20px 0"}}>
                            <Col span={3}><label>纬度：</label></Col>
                            <Col span={12}>
                                <Input defaultValue={this.state.changelat} onChange={(e)=>this.changeCoord(e,'changelat')} />
                            </Col>
                        </Row>
                    </Fragment>

                </Modal>
                <Modal
                    title={[
                        <div className="zuserdeModel">
                            <span className="zModelBlock"/>
                            <span className="zmodelFont">编辑当前位置</span>
                        </div>
                    ]}
                    visible={this.state.addreditSwitch}
                    onOk={this.addreditOk}
                    onCancel={this.addreditCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Row>
                        <CascaderModule onRef={this.onRef} style={{width:'100%'}}/>
                       <Input placeholder="请输入详细地址" className="zmoadlinput" onChange={(e)=>this.changeCoord(e,'addrdetail')} />
                    </Row>
                </Modal>
            </div>

        )
    }
}
export default Userdeveice=Form.create()(Userdeveice);
