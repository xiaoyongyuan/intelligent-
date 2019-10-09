import React,{Component} from "react";
import {Row,Col} from "antd";
import {post} from "../../axios/tools";
import "../../style/ztt/css/rollCall.css";
import err from "../../style/imgs/err.png";

let vis=false;
class RollcallRecordModel extends Component {
    constructor(props){
        super(props);
        this.state={
            rollset:{},
        };
    }
    componentDidMount() {
        this.setState({
            code:this.props.code,
            activecompcode:this.props.activecompcode
        },()=>{
            this.requestData()
        })  
    }   
    componentWillReceiveProps(nextProps){
        if( nextProps.visible !== vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                vis=nextProps.visible;
                this.setState({
                    code:nextProps.code,
                    activecompcode:nextProps.activecompcode
                }, () => {
                    this.requestData()});
            }
        }         
    }
    requestData(){
        post({url:"/api/rollcalldetail/getone",data:{code:this.state.code,passivecode:this.state.activecompcode}},(res)=>{
            if(res.success){
                if(!res.data.rrpic) res.data.rrpic=err;
                this.setState({
                    rollset:res.data
                },()=>{
                    this.draw()
                })
            }
        })
    }
    draw = ()=>{ //画报警对象
        let ele = document.getElementById("canvasobj");
        let area = ele.getContext("2d");
        area.clearRect(0,0,604,476);//清除之前的绘图
        area.lineWidth=1;
        const rfinalzone=this.state.rollset.rfinalzone;
        const datafield=rfinalzone?JSON.parse(this.state.rollset.rfinalzone):[];
        if(datafield.length){
          const xi=604/704, yi=476/576;
          let areafield = ele.getContext("2d"); 
          area.lineWidth=1;  
          const x=604/this.state.rollset.rwidth, y=476/this.state.rollset.rheight;
          datafield.map((el,i)=>{
            area.strokeStyle='#ff0';
            area.beginPath();
            area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
            area.stroke();
            area.closePath();
          }) 
        }
    }
    rfinaltype=()=>{
        const rfinal=this.state.rollset.rfinal;
        switch(rfinal){
            case -2:
                return '点名失败';
            case -1:
                return '执行中';
            case 1:
                return '正常';
            case 2:
                return '对象存在状态异常';
        }
    }
    rfinalColor=()=>{
        const rfinal=this.state.rollset.rfinal;
        switch(rfinal){
            case -2:
                return '#797975';
            case -1:
                return '#797975';
            case 1:
                return '#54CD66';
            case 2:
                return 'red';
        }
    }
    normal =(status)=>{
        if(status===0){
            return "fontColor rollcallModelTitle";
        }else if(status===1){
            return "fontColor1 rollcallModelTitle";
        }
    };

    render(){
        return(
            <div className="rollcallRecordModel">
                <Row><Col span={24} className="rollcallModelTitle fontSizeModel">{this.state.rollset.cameraname} - {this.state.rollset.rname}</Col></Row>
                <Row className="rollcallModel">
                    <Col span={24} style={{textAlign:"center"}}>
                        <canvas id="canvasobj" width="604px" height="476px" style={{backgroundImage:'url('+this.state.rollset.rrpic+')',backgroundSize:"100% 100%"}} />
                    </Col>
                </Row>
                <Row className="rollcallModel">
                    <Col span={8} className="rollcallModelTitle">{this.state.rollset.resultdate}</Col>
                    <Col span={8} className="rollcallModelTitle">{this.state.rollset.ifeveryday===0?"自动点名":"手动点名"}</Col>
                    <Col span={8} className={this.normal(this.state.rollset.rfinal)}>
                        <span style={{color:this.rfinalColor()}}>{this.rfinaltype()}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default RollcallRecordModel;