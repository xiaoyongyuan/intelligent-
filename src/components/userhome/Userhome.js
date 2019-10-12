import React from 'react';
import { Card ,Row, Col,Timeline} from 'antd';
import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
import Equipment from './Equipment';
class Userhome extends React.Component{
    constructor(props){
      super(props);
      this.state={
        camera:[],
        data:{},
        usercount:"0",
        alarmdata:[]
      };
    }
    componentDidMount() { 
        let utypes= localStorage.getItem("user");
        let utypeObj=JSON.parse(utypes);
        this.setState({
            utype: utypeObj.utype
        },()=>{
            
        })
        this.inter()      
        post({url:'/api/company/getone'},(res)=>{ //获取团队列表
            if(res){
                this.setState({
                    data:res.data, //用户信息
                    usercount:res.usercount, //用户信息
                    camera:res.camera, //摄像头信息                  
                }); 
            }   
        })
        this.timerID = setInterval(
            () => this.inter(),5000);
           
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
      }
    inter(){
          post({url:'/api/alarm/getlastalarm'},(res)=>{ //获取报警列表
            if(res){
                this.setState({
                    alarmdata:res.data, 
                }); 
            }   
        })
    }
 

    field=(i)=>{ //布防区域的个数 
        var jsonData;
        if(this.state.camera[i].field ===""){
             jsonData=0;
        }else{
             jsonData= JSON.parse(this.state.camera[i].field)
        }    
        var count = 0;
        for(var j in jsonData){
            count++;
        }
        return count;
    }
    isonline=(i)=>{ //是否在线
        if(this.state.camera[i]&&this.state.camera[i].heart.time){
            let time= this.state.camera[i].heart.time.toString();// 取到时间
            let yijingtime=new Date(time); //取到时间转换
            let timq=yijingtime.getTime(yijingtime) // 取到时间戳
            let myDate=new Date();// 当前时间
            let timc=myDate.getTime(myDate) // 当前时间戳     
            if(timc-timq>60000){
                return(<div className="onLine offLineBack">离线</div>)
            }else{
                return(<div className="onLine onLineBack">在线</div>)
            }
        }else{
           return(<div className="onLine offLineBack">离线</div>)
        }
   }

   atype=(j)=>{ //报警类型 
        if(this.state.alarmdata[j].atype===1){
            return "入侵报警"
        }else{
            return "";
        }          
    }
    render(){
        var styleObj={
            successBg:{ background:'#96FF66'},
        }
        return(       
            <div className="div_box_a">
                 <Row>
                    <div className="paddL">
                      {/* <Card className=""
                            title={this.state.data.cname}
                            style={styleObj.topMar}
                            extra={this.state.alarmdata.length === 5 ? <a href="#/app/userhome/Alarmlist">更多报警</a> : ''}                        
                      > */}
                            <Row>
                                < Col span = {
                                    9
                                }
                                className = "home_tole hom_chil" >
                                  <h5>{this.state.data.cname}</h5>
                                   <p> <span> 云服务到期日期:</span> <span>{this.state.data.cloudvaliddate?this.state.data.cloudvaliddate:'无期限'}</span></p>
                                <p> <span> 设备总数: </span> <span className="fontAr">{this.state.camera.length ? this.state.camera.length : 0}</span >个 </p>
                                   <p> <span> 所属团队: </span> <span>{this.state.data.pname?this.state.data.pname:"未绑定"}</span > </p>
                                <p> <span> 用户数: </span> <span className="fontAr"> {this.state.usercount?this.state.usercount:0}</span > </p>
                                <p> <span> 管理员: </span> <span className="fontAr">{this.state.data.adminname?this.state.data.adminname:"********"}</span > </p>
                                </Col>
                                
                    < Col span={14}
                      offset={1}
                      className = "home_tori hom_chil" >

                       {
                         this.state.alarmdata.map((item,j)=>{
                                return (
                                  <div className="list_hom clearfix">
                                    <span className="span_xx">{this.state.alarmdata[j].name}</span>
                                    <span>{this.atype(j)}</span>
                                    <span className="fontAr">{this.state.alarmdata[j].atime}</span>
                                    
                                    {/* <span>16:58:35 {this.state.alarmdata[j].atime}</span> */}
                                  </div>
                                )
                            })
                       }         
                        {/* <div className="list_hom clearfix">
                          <span className="span_xx">测试</span>
                          <span>入侵报警</span>
                          <span>2019-10-10</span>
                          <span>16:58:35</span>
                        </div>

             
                      <Timeline>
                                            {
                                                this.state.alarmdata.map((item,j)=>{
                                                    return (
                                                        <Timeline.Item key={j}>
                                                        <span> {this.state.alarmdata[j].name}  </span>
                                                        <span> {this.atype(j)} </span> 
                                                         {this.state.alarmdata[j].atype}  
                                                        <span>{this.state.alarmdata[j].atime}</span>   
                                                    </Timeline.Item>
                                                    )
                                                })
                                            } 

                      </Timeline> */}
                      


                                </Col>
                            </Row>
                        {/* </Card> */}
                    </div>
                </Row>
                <Row className="paddRow"> 
                   <Equipment />
                </Row>
            </div>
        )
    }
}
export default Userhome
