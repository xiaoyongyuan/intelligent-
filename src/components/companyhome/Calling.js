import React,{ Component } from 'react';
import {Row,Col,Modal,Spin,message} from 'antd';
import '../../style/sjg/home.css';
import BreadcrumbCustom from '../BreadcrumbCustom';
import "../../style/yal/css/calling.css";
import {post} from "../../axios/tools";
import moment from "moment";
class Calling extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type:0,
            list:[],
            count:4,
            normal:18,
            unusual:2,
            totalcount:0, //点名数量
            duration:'', //点名起始时间
        };
        this.showModal=this.showModal.bind(this);
    }
    componentWillMount(){
        this.setState({
            code:this.props.query.id,
            duration:moment().format('YYYY-MM-DD HH:mm:ss'),
        });
    }
    componentDidMount() {
        this.reuestdata();
        this.showModal();
    }

    reuestdata =(parameter={})=>{ //全部点名查询
        const _this=this;
        post({url:"/api/rollcalldetail/getlist_bytask",data:{taskid:this.state.code}},(res)=>{
            if(res.success){
                this.setState({
                    list:res.data,
                    totalcount:res.totalcount,
                })
            }
        })
        let inter=setInterval(()=>{
            if(moment()-moment(_this.state.duration)>15000){ 
                clearInterval(inter);
                message.warn('系统繁忙，请稍后再试',2,function(){
                    // _this.props.history.go(-1);
                });
                return;
            }
            post({url:"/api/rollcalldetail/getlist_bytask",data:{taskid:this.state.code}},(res)=>{
                if(res.success){
                    this.setState({
                        list:res.data,
                        visible:res.unhandle?true:false,
                        edate:Math.ceil((moment()-moment(_this.state.duration))/1000)
                    })
                }else{
                  clearInterval(inter);  
                }
            })
        },2000);

        
    };
    showModal = () => {
        this.setState({
            visible: true,
            type:1
        });
    }
    render() {
        return(
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="点名" second="点名任务" />
                <div className="dmword">
                    <span style={{display:this.state.type?"block":"none"}}>此次点名共<b>{this.state.totalcount}</b>个对象
                    {this.state.edate
                        ?<div />
                        :''
                    }</span>
                    <span style={{display:this.state.type?"none":"block"}}>此次点名共<b>{this.state.count}</b>个对象，用时<b>14</b>秒。<b>{this.state.unusual}</b>个异常，<b>{this.state.normal}</b>个正常。</span>
                </div>
                <div className="divRow">
                    <Row gutter={50}>
                        {this.state.list.map((el,i)=>(
                        <Col className="gutter-row" span={7} key={i}>
                            <div className="gutter-box divout" style={{border:this.state.type?"none":"2px solid #E5E5E5" ,background:this.state.type?"none":"#fff" ,height:this.state.type?"230px":"460px"}} >
                                <div className="divinnertop" style={{border:this.state.type?"2px solid #E5E5E5":"none", height:this.state.type?"100%":"50%"}}>
                                    <div className="divinnertopT" />
                                    <div className="divinnertopM">
                                        <div className="divinnertopML">
                                            <div className="divimg">
                                                <img src={el.rpic} className="img-responsive" alt="test" style={{width:"100%",height:"100%"}} />
                                            </div>
                                        </div>
                                        <div className="divinnertopMR">
                                            <div className="divinnertopMRT">
                                                <span>{el.rname}</span>
                                            </div>
                                            <div className="divinnertopMRB">
                                                <span>{el.cameraname}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divinnertopB" style={{display:this.state.type?"none":"block"}}>
                                        <Row>
                                            <Col md={8} offset={2}>
                                                <span>结果:</span>
                                            </Col>
                                            <Col md={5}>
                                                {
                                                    el.rfinal
                                                    ?<div>
                                                    {el.rfinal===1
                                                    ? <span style={{ color:"green" }}>正常</span>
                                                    : <span style={{ color:"red" }}>报警</span>
                                                    }   
                                                    </div>
                                                    :<span>点名中...</span>
                                                    
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                { el.rfinal
                                ?<div className="divinnerbottom" style={{display:this.state.type?"none":"block"}}>
                                    <div className="divinnerbottomimg">
                                        <img src={el.rrpic} className="img-responsive" alt="test" style={{width:"100%",height:"100%"}} />
                                    </div>
                                </div>
                                :''
                                }
                            </div>
                        </Col>
                        ))
                        }
                    </Row>
                </div>
                <div className="modelcircle">
                    <Modal visible={this.state.visible} className="modelCard" />
                    <div className="scanningImg" style={{display:this.state.type?"block":"none"}}><Spin size="large" /></div>
                </div>
            </div>
        );
    }
}
export default Calling