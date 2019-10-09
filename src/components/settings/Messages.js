import React, { Component } from 'react';
import { Tabs,Collapse, Spin,Badge,Modal,Pagination } from 'antd';
import "../../style/ztt/css/message.css";
import replay_move from "../../style/ztt/img/message/replay_move.png";
import colck from "../../style/ztt/img/message/colck.png";
import rep from "../../style/ztt/img/message/rep.png";
import ot from "../../style/ztt/img/message/ot.png";
import move_time from "../../style/ztt/img/message/move_time.png";
import user_move from "../../style/ztt/img/message/user_move.png";
import untying from "../../style/ztt/img/message/untying.png";
import binding from "../../style/ztt/img/message/binding.png";
import camera from "../../style/ztt/img/message/camera.png";
import equipment from "../../style/ztt/img/message/equipment.png";
import renew from "../../style/ztt/img/message/renew.png";
import nodata from "../../style/imgs/nodata.png";
import {post} from "../../axios/tools";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
class Messages extends Component {
    constructor(props){
        super(props);
        this.state= {
            visible:false,
            listsMess:[],
            page:1,//当前页数
            loading:true
        };
    }
    componentDidMount() {
       this.getListMess();
    }
    //全部
    getListMess=()=>{
        let params={
            pagesize:10,
            pageindex: this.state.page,
            atype:this.state.atypeTab,//整点打卡  值守报表
            searchtype:this.state.sreachTab,//异动
            others:this.state.others//其他
          };
        post({url:"/api/alarminfo/getlist",data:params},(res)=>{
            if(res.success){
                this.setState({
                    listsMess:res.data,
                    totalcount:res.totalcount,
                    loading:false
                })
            }
        })
    };
    //弹窗打开
    hanldImg=(pic_min)=>{
        this.setState({
            picMin:pic_min,
            visible:true
        })
    };
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    };
    //折叠面板
    callbackCollapse=(key)=> {
        if(key){
            let datas={
                code:key,
                atype:this.state.atypeTab,//整点打卡  值守报表
                searchtype:this.state.sreachTab,//异动
                others:this.state.others//其他
            };
            post({url:"/api/alarminfo/getone",data:datas},(res)=>{
                if(res.success){
                    this.setState({
                        pic_min:res.data.pic_min,
                        name:res.data.name,
                        memoGet:res.data.memo,
                    },()=>{
                        //消息查看
                        if(res.data.status===0){
                            post({url:"/api/alarminfo/update",data:{code:res.data.code,status:1}},(res)=>{
                                if(res.success){
                                    this.getListMess();
                                }
                            });
                        }
                    })
                }
            });
        }
    };
    //标签页
    callbackTab=(key)=>{
        if(key==1){
            this.setState({
                atypeTab:"",
                sreachTab:"",
                others:"",
                loading:true,
                page:1
            },()=>{
                this.getListMess();
            })
        }else if(key==2){
            this.setState({
                sreachTab:1,
                atypeTab:"",
                others:"",
                loading:true,
                page:1
            },()=>{
                this.getListMess();
            })
        }else if(key==5){
            this.setState({
                sreachTab:"",
                atypeTab:"",
                others:1,
                loading:true,
                page:1
            },()=>{
                this.getListMess();
            })
        }else{
            this.setState({
                atypeTab:key,
                sreachTab:"",
                others:"",
                loading:true,
                page:1
            },()=>{
                this.getListMess();
            });
        }
    };
    //分页
    handlePage=(page)=>{
        this.setState({
            page,
            loading:true
        },()=>{
            this.getListMess();
        });
    };
     //类型
     messAtype=(atype)=>{
        if(atype===12){
            return "整点打卡";
        }else if(atype===7004){
            return "布防方式设置异动";
        }else if(atype===7006){
            return "账户异动";
        }else if(atype===7007){
            return "设备绑定";
        } else if(atype===7005){
            return "设备解绑";
        }else if(atype===7001 || atype===7003){
            return "防区时间异动";
        }else if(atype===7002){
            return "摄像头绑定操作";
        } else if(atype===7008){
            return "值守报表";
        } else if(atype===8001){
            return "设备过期";
        }else if(atype===8002){
            return "设备续费恢复使用";
        } else{
            return "其他";
        }
    };
    //图标
    hanldImgIcon=(atype)=>{
        if(atype===12){
            return colck;
        }else if(atype===7004){
            return replay_move;
        }else if(atype===7006){
            return user_move;
        }else if(atype===7007){
            return binding;
        }else if(atype===7005){
            return untying;
        }else if(atype===7001 || atype===7003){
            return move_time;
        }else if(atype===7002){
            return camera;
        }else if(atype===7008){
            return rep;
        }else if(atype===8001){
            return equipment;
        }else if(atype===8002){
            return renew;
        }else{
            return ot;
        }
    };
    //分页页面
    pagination=()=>{
        return(
            <Pagination  defaultCurrent={1}
                         current={this.state.page}
                         total={this.state.totalcount}
                         defaultPageSize={10}
                         hideOnSinglePage={true}
                         onChange={this.handlePage}
                         className="pagination"
                         style={{display:this.state.listsMess.length?"block":"none"}}
            />
        )
    };
    //getone内容
    panelText=()=>{
        return(
            <div className="panelText">
                <img src={this.state.pic_min} alt="" onClick={()=>this.hanldImg(this.state.pic_min)} style={{display:this.state.pic_min?"block":"none"}} />
                <p>{this.state.memoGet}</p>
            </div>
            )
    };
    //无数据nodata图片
    handleNodata=()=>{
        return(
            <div className="nodatas" style={{display:this.state.listsMess.length?"none":"block"}}><img src={nodata} /></div>
        )
    };
    render() {
        return (
           <div className="Messages">
               <div className="messages-top">
                   <Tabs defaultActiveKey="1" onChange={this.callbackTab}>
                       <TabPane tab="全部" key="1">
                           <Spin size="large" spinning={this.state.loading}>
                               <Collapse onChange={this.callbackCollapse} accordion>
                                   {this.state.listsMess.map((v,i)=>(
                                           <Panel header={
                                               <div className="messTime">
                                                   <div className="messAll">
                                                       <Badge dot style={{display:v.status===1?"none":"block"}}>
                                                           <div className="mesICon"><img src={this.hanldImgIcon(v.atype)} alt="" /></div>
                                                       </Badge>
                                                       <div className="messFont">
                                                           <span>{this.messAtype(v.atype)}</span>
                                                           <span>{v.memo}</span>
                                                       </div>
                                                   </div>
                                                   <div className="messData">{v.atime}</div>
                                               </div>}
                                                  key={v.code}
                                           >
                                             {this.panelText()}
                                           </Panel>
                                       ))
                                   }
                               </Collapse>
                               {this.handleNodata()}
                               {this.pagination()}
                           </Spin>
                       </TabPane>
                       <TabPane tab="异动" key="2">
                           <Spin size="large" spinning={this.state.loading}>
                               <Collapse onChange={this.callbackCollapse} accordion>
                                   {this.state.listsMess.map((v)=>(
                                       <Panel header={
                                           <div className="messTime">
                                               <div className="messAll">
                                                   <Badge dot style={{display:v.status===1?"none":"block"}}>
                                                       <div className="mesICon"><img src={this.hanldImgIcon(v.atype)} alt="" /></div>
                                                   </Badge>
                                                   <div className="messFont">
                                                       <span>{this.messAtype(v.atype)}</span>
                                                       <span>{v.memo}</span>
                                                   </div>
                                               </div>
                                               <div className="messData">{v.atime}</div>
                                           </div>}
                                              key={v.code}
                                       >
                                           {this.panelText()}
                                       </Panel>
                                   ))
                                   }
                               </Collapse>
                           </Spin>
                           {this.handleNodata()}
                           {this.pagination()}
                       </TabPane>
                       <TabPane tab="整点打卡" key="12">
                           <Spin size="large" spinning={this.state.loading}>
                               <Collapse onChange={this.callbackCollapse} accordion>
                                   {this.state.listsMess.map((v)=>(
                                       <Panel header={
                                           <div className="messTime">
                                               <div className="messAll">
                                                   <Badge dot style={{display:v.status===1?"none":"block"}}>
                                                       <div className="mesICon"><img src={colck} alt="" /></div>
                                                   </Badge>
                                                   <div className="messFont">
                                                       <span>整点打卡</span>
                                                       <span>{v.memo}</span>
                                                   </div>
                                               </div>
                                               <div className="messData">{v.atime}</div>
                                           </div>}
                                              key={v.code}
                                       >
                                           {this.panelText()}
                                       </Panel>
                                   ))
                                   }
                               </Collapse>
                           </Spin>
                           {this.handleNodata()}
                           {this.pagination()}
                       </TabPane>
                       <TabPane tab="值守报表" key="7008">
                           <Spin size="large" spinning={this.state.loading}>
                               <Collapse onChange={this.callbackCollapse} accordion>
                                   {this.state.listsMess.map((v)=>(
                                       <Panel header={
                                           <div className="messTime">
                                               <div className="messAll">
                                                   <Badge dot style={{display:v.status===1?"none":"block"}}>
                                                       <div className="mesICon"><img src={rep} alt="" /></div>
                                                   </Badge>
                                                   <div className="messFont">
                                                       <span>值守报表</span>
                                                       <span>{v.memo}</span>
                                                   </div>
                                               </div>
                                               <div className="messData">{v.atime}</div>
                                           </div>}
                                              key={v.code}
                                       >
                                           {this.panelText()}
                                       </Panel>
                                   ))
                                   }
                               </Collapse>
                           </Spin>
                           {this.handleNodata()}
                           {this.pagination()}
                       </TabPane>
                       <TabPane tab="其他" key="5">
                           <Spin size="large" spinning={this.state.loading}>
                               <Collapse onChange={this.callbackCollapse} accordion>
                                   {this.state.listsMess.map((v)=>(
                                       <Panel header={
                                           <div className="messTime">
                                               <div className="messAll">
                                                   <Badge dot style={{display:v.status===1?"none":"block"}}>
                                                       <div className="mesICon"><img src={this.hanldImgIcon(v.atype)} alt="" /></div>
                                                   </Badge>
                                                   <div className="messFont">
                                                       <span>{this.messAtype(v.atype)}</span>
                                                       <span>{v.memo}</span>
                                                   </div>
                                               </div>
                                               <div className="messData">{v.atime}</div>
                                           </div>}
                                              key={v.code}
                                       >
                                           {this.panelText()}
                                       </Panel>
                                   ))
                                   }
                               </Collapse>
                           </Spin>
                           {this.handleNodata()}
                           {this.pagination()}
                       </TabPane>
                   </Tabs>
               </div>
               <Modal
                   visible={this.state.visible}
                   onCancel={this.handleCancel}
                   footer={null}
                   width={700}
                   className="modelImg"
               >
                   <img src={this.state.picMin} alt="" />
               </Modal>
           </div> 
        )
    }
}
export default Messages;