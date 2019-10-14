import React from 'react';
import {Card,Row,Col,Icon,Spin,message} from 'antd';
import '../../style/sjg/home.css';
import {post} from "../../axios/tools";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import nopic from "../../style/imgs/nopic.png";
import nodata from "../../style/imgs/nodata.png";
class Equipment extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activecompcode:props.auth&&props.auth.active?props.auth.active.activecompanycode:'', //当前查看的公司
            camera:[],
            loading:true,
            type:1,
            nodatapic:true,
        };
      }
    componentDidMount() {
        post({url:'/api/camera/get_camerainfolist',data:{passivecode:this.state.activecompcode}},(res)=>{ //获取团队列表
            if(res){
                if(res.camera.length===0){
                    this.setState({
                      nodatapic:false,
                  })
              }
                if(res.camera.length){
                    this.setState({
                        loading:false,
                        data:res.data, //用户信息
                        res:res, //用户信息
                        camera:res.camera, //摄像头信息
                        type:1
                    })
                    var datas=new Date().getTime();
                    res.camera.map((v)=>{
                        if(v.heart.time){
                            if(datas-new Date(v.heart.time).getTime()>60000){
                                this.setState({liveIcon:false})
                            }else{
                                this.setState({liveIcon:true})
                            }
                        }else{
                            this.setState({liveIcon:false})
                        }
                    })

                }else{
                    this.setState({
                        loading:false,
                        type:0
                    })
                }
            } else{
                this.setState({
                    loading:false,
                    type:0
                })
            }
        })

    }
    shouldComponentUpdate=(nextProps,nextState)=>{
        if(nextProps.auth.active.activecompanycode != nextState.activecompcode){
            this.setState({
                activecompcode:nextProps.auth.active.activecompanycode,
                loading:true,
                camera:[]
            },()=>{
                this.componentDidMount()
            })
        }
        return true;
    }

    statework=(i)=>{ //布防转换
        if(this.state.camera[i].work===2){
            return (<span className="defenceEqui"><span className="zdefense"/><span className="zdefense1">布防</span></span>)
        }else if(this.state.camera[i].work===1){
            return (<span className="nodefence"><span className="zWithdrawal"/><span className="zWithdrawal1">撤防</span></span>)
        }else{
            return (<span className="nodefence"><span className="zWithdrawal"/>撤防</span>)
        }
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
    };
    momenttime = bdate => { //判断时间是否在一分钟内
      if (!bdate) return false;
      if (new Date().getTime() - new Date(bdate).getTime() > 60000) {
        return false;
      } else {
        return true;
      }
    };
    isonline=(i)=>{ //是否在线

      if(this.state.camera[i]&&this.state.camera[i].heart){
        let hearttime= this.state.camera[i].heart.time;
        let lasttime= this.state.camera[i].lasttime;

        if (!this.momenttime(lasttime) && !this.momenttime(hearttime)) {
          return(<div className="zoffLine"></div>)
        }else return(<div className="zonline"></div>)

      }else{
        return(<div className="zoffLine"></div>)
      }

   }

    render(){
        return(
                <div className="equipment">
                    <Spin size="large" tip="加载中......" spinning={this.state.loading} className="loadding" />
                    {this.state.nodatapic?"":
                    <Row style={{display:this.state.type===0?"block":"none",paddingTop:"40px"}}>
                        <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                    </Row>}
                    <div className="equipmentCard">
                        <Row className="paddRow" gutter={32}>
                            {
                                this.state.camera.map((el,i)=>{
                                return(
                                    <Col key={i} xxl={{ span: 5 }} xl={{ span: 8 }}
                                        className="cardPdd ">
                                        <a href={"#/app/live/index?id=" + el.eid}
                                            style={{ display: this.state.liveIcon ? "block" : "none" }}>
                                            <Icon type="play-circle" style={{ color: "#fff", fontSize: "35px", position: " absolute", left: "60%", top: "30%", zIndex: 10 }} /></a>
                                        <Card className="boxShow"
                                              cover={<img alt="example" src={this.state.camera[i].picpath?this.state.camera[i].picpath:nopic}  />}
                                              actions={
                                                  this.state.utype==='1' || this.state.activecompcode
                                                      ?[
                                                          <div className="actionsBbottom">
                                                              {this.statework(i)}
                                                          </div>,
                                                          <div className="actionsBbottom colCen ">
                                                              {this.statework(i)}
                                                          </div>,
                                                          <div className="colCen actionsBbottom ">
                                                              <span className="sheding"><span className="zsetup"/><span className="zsetup1">设定</span></span>
                                                          </div>
                                                      ]
                                                      :[
                                                          <a href={"#/app/companyhome/settime?id="+el.code} className="actionsBbottom colCen">
                                                              {this.statework(i)}
                                                          </a>,
                                                          <a href={"#/app/userhome/Userdeveice?id="+el.code} className="colCen actionsBbottom ">
                                                             <span className="sheding"><span className="zsetup"/><span className="zsetup1">设定</span></span>
                                                          </a>
                                                      ]}
                                        >
                                            <Row className="zpaddRow">
                                                <Col span={12}>
                                                    <div className="equipmentRight ">
                                                        <div className="coverflow" title={el.name}>{el.name}</div>
                                                        <div className="coverflow fontAr" title={el.eid}>{el.eid}</div>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <a href={"#/app/userhome/Alarmlist?id="+el.code+"&type=0"}>
                                                        <span>{this.isonline(i)}</span>
                                                    </a>
                                                </Col>
                                            </Row>
                                            <div className="zfiled">
                                                <div className="zfileNumer">
                                                    <span>防区数量：<span className="zfilec fontAr">{this.field(i)}</span></span>
                                                </div>
                                                <div className="zeditIcon">
                                                    <a href={"#/app/companyhome/setarea?id="+el.code+"&eid="+el.eid}>
                                                        <span className="zeidt"/>
                                                    </a>
                                                </div>
                                            </div>
                                            <Row className="zalarm zfiled">
                                                <Col spam={24}>报警数次：<span className="zNumber fontAr">{this.state.camera[i].alarm}</span></Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            })
                           }
                        </Row>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => {
    const { auth } = state.httpData;
    return {auth};
};
export default withRouter(connect(mapStateToProps)(Equipment));
