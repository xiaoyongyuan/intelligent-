import React, { Component } from 'react';
import {message,Button,Modal,Icon } from 'antd';
import '../../style/lff/home.css';
import "../../style/publicStyle/publicStyle.css";
import policeImg from "../../style/ztt/img/policeimg.png";
import {post} from "../../axios/tools";
const blue='#5063ee';
const red='#ED2F2F';
var flashVis=0;
class Setarea extends Component {
    constructor(props){
        super(props);
        this.state={
            src:'',
            clicknum:0,
            present:[],
            areaone:[], //防区一
            areatwo:[], //防区二
            baseBtn:false,//控制更新底图
            repaint:false,//控制防区提交面板显示隐藏
            defenBtn:false,//判断新建防区按钮是否禁用或使用状态
            deletedefen:false,//删除防区弹窗
            deleteshow:false,//新增防区弹窗
        };
    }
    componentWillMount=()=>{
        this.setState({
            cid:this.props.query.id,
            eid:this.props.query.eid,
        });
    }
    componentDidMount() {
    //摄像头详情
        post({url:'/api/camera/getone',data:{code:this.state.cid}},(res)=>{
            if(res){
                let field=res.data.field,areaone=[],areatwo=[];
                if(field){
                    areaone=field[1]?JSON.parse(field[1]):[];
                    areatwo=field[2]?JSON.parse(field[2]):[];
                }
                this.setState({
                        areaone:areaone,
                        areatwo:areatwo,
                        src:res.data.fieldpath,
                    },()=>{
                        this.boundarydraw()
                    });

            }
        })

    }
    boundarydraw(){
        let ele = document.getElementById("time_graph_canvas");
        let area = ele.getContext("2d");
        area.clearRect(0,0,704,576);
        if(this.state.areaone.length){
                let areaone=this.state.areaone[0];
                area.strokeStyle=blue;
                area.lineWidth=3;
                area.beginPath();
                area.moveTo(areaone[0][0],areaone[0][1]);
                area.lineTo(areaone[1][0],areaone[1][1]);
                area.lineTo(areaone[2][0],areaone[2][1]);
                area.lineTo(areaone[3][0],areaone[3][1]);
                area.lineTo(areaone[0][0],areaone[0][1]);
                area.stroke();
                area.closePath();
                if(this.state.areatwo.length){
                    let areatwo=this.state.areatwo[0];
                    area.strokeStyle=red;
                    area.beginPath();
                    area.moveTo(areatwo[0][0],areatwo[0][1]);
                    area.lineTo(areatwo[1][0],areatwo[1][1]);
                    area.lineTo(areatwo[2][0],areatwo[2][1]);
                    area.lineTo(areatwo[3][0],areatwo[3][1]);
                    area.lineTo(areatwo[0][0],areatwo[0][1]);
                    area.stroke();
                    area.closePath();
                }
        }else if(this.state.areatwo.length){
            let areatwo=this.state.areatwo[0];
            area.strokeStyle=red;
            area.lineWidth=3;
            area.beginPath();
            area.moveTo(areatwo[0][0],areatwo[0][1]);
            area.lineTo(areatwo[1][0],areatwo[1][1]);
            area.lineTo(areatwo[2][0],areatwo[2][1]);
            area.lineTo(areatwo[3][0],areatwo[3][1]);
            area.lineTo(areatwo[0][0],areatwo[0][1]);
            area.stroke();
            area.closePath();
        }

    }


    draw = () => { //绘制区域
        let item=this.state.present;
        let ele = document.getElementById("time_graph_canvas");
        let area = ele.getContext("2d");
        area.strokeStyle='#ff0';
        area.lineWidth=3;
        area.beginPath();
        area.moveTo(item[0][0],item[0][1]);
        item.map((elx,i)=>{
            if(i>0){
               area.lineTo(item[i][0],item[i][1]);
               if(i===3){
               area.lineTo(item[0][0],item[0][1]);
               }
               area.stroke();
            }
        })
    }

    clickgetcorrd =(e)=> { //点击
        if (!this.state.areaone.length || !this.state.areatwo.length) {
            if (this.state.present.length != 4) {
                let getcord = this.getcoord(e); //获取点击的坐标
                let precorrd = this.state.present;
                precorrd.push(getcord);
                this.setState({
                    clicknum: this.state.clicknum + 1,
                    present: precorrd
                });
            }
        }
    }
    //重新绘制
    hanleRepaint=()=>{
        let ele = document.getElementById("time_graph_canvas");
        let area = ele.getContext("2d");
        area.clearRect(0,0,704,576);
        this.setState({
            present:[]
        });
        this.boundarydraw();
    };
    getcoord = (coords) => { //获取坐标
        let ele = document.getElementById("time_graph_canvas");
        let canvsclent = ele.getBoundingClientRect();
        let x= coords.clientX - canvsclent.left * (ele.width / canvsclent.width);
        let y= coords.clientY - canvsclent.top * (ele.height / canvsclent.height)
        let pre=[x,y]
        return pre
    }
    drawmove =(e)=>{ //移动
        if(this.state.clicknum){
            let ele = document.getElementById("time_graph_canvas");
            let area = ele.getContext("2d");
            let item=this.state.present;
            let getcord=this.getcoord(e);
            area.clearRect(0,0,704,576);//清除之前的绘图
            if(this.state.clicknum===4){//区域完成
                this.boundarydraw();
                this.draw();
                this.setState({
                    clicknum: 0
                });
            }else{
                this.boundarydraw();
                this.draw();
                area.strokeStyle='#ff0';
                area.lineWidth=3;
                area.beginPath();
                area.moveTo(item[item.length-1][0],item[item.length-1][1]);
                area.lineTo(getcord[0],getcord[1]);
                area.stroke();
                area.closePath();
            }

        }

    };
    //新建防区按钮背景色
    hanledefenBg=()=>{
        if(this.state.defenBtn){
            return "prohibitBtn";
        }else{
            return "newdefnbtn";
        }
    };
    //删除防区按钮背景色
    hanledeleteBg=()=>{
        if(this.state.defenBtn){
            return "prohibitBtn";
        }else{
            return "queryBtn";
        }
    };
    //关闭防区操作显示面板
    hanleClose=()=>{
        this.setState({
            repaint:false,
            defenBtn:false,
            baseBtn:false
        });
        this.setState({
            present:[]
        });
        this.boundarydraw();
    };
    //新建防区
    hanlAddDef=(index)=>{
        this.setState({
            deleteshow:true,
            textadd:index
        });
    };
    //提示框打开
    deleteok=()=>{
        this.setState({
            deleteshow: false,
            repaint:true,
            defenBtn:true,
            baseBtn:true
        });
    };
    deleteCancel=()=>{
        this.setState({
            deleteshow: false,
            repaint:false,
            defenBtn:false,
            baseBtn:false
        });
    };
    submitok=()=>{
        if(this.state.present.length===4 && this.state.textadd){
            if(this.state.textadd===1){
                post({url:'/api/camera/fieldadd',data:{key:this.state.textadd,field:JSON.stringify([this.state.present]),code:this.state.cid}},(res)=>{
                    if(res.success){
                        this.setState({
                            areaone:[this.state.present],
                            present:[],
                            repaint:false,
                            defenBtn:false,
                            baseBtn:false
                        },()=>{
                            this.boundarydraw()
                        });

                    }
                })
            }else if(this.state.textadd===2){
                post({url:'/api/camera/fieldadd',data:{key:this.state.textadd,field:JSON.stringify([this.state.present]),code:this.state.cid}},(res)=>{
                    if(res.success){
                        this.setState({
                            areatwo:[this.state.present],
                            present:[],
                            repaint:false,
                            defenBtn:false,
                            baseBtn:false
                        },()=>{
                            this.boundarydraw()
                        });

                    }
                })
            }
        }
    }
    /*获取底图*/
    changeBase=()=>{
        post({url:"/api/equipment/get_basemap",data:{eid:this.state.eid}},(res)=>{
            if(res.success){
                flashVis=0;
                this.setState({
                    baseBtn:true
                });
                this.hanleresult(res.data);
            }
        })
    };
    /*获取底图结果*/
    hanleresult=(code)=>{
        post({url:"/api/smptask/getone",data:{code:code,apptype:1}},(res)=>{
            if(res.success){
                if(res.data.taskstatus==1){
                    flashVis=0;
                    let task=JSON.parse(res.data.taskresult);
                    this.setState({
                        src:task.path,
                        nowTime:Date.parse(new Date())
                    })
                }else if(res.data.taskstatus==0){
                    flashVis++;
                    if(flashVis>150){
                        message.warning("请求超时!");
                        this.setState({
                            baseBtn:false
                        });
                        return false;
                    }else{
                        this.hanleresult(code);
                    }
                }
            }
        })
    };
    //删除防区弹窗打开
    hanleDeleteDef=(index)=>{
        this.setState({
            deletedefen:true,
            deleIndex:index
        })
    };
    //删除防区弹窗确认
    deletedefenOk=()=>{
        if(this.state.deleIndex && this.state.cid){
            if(this.state.deleIndex===1){
                post({url:'/api/camera/fielddel',data:{key:this.state.deleIndex,code:this.state.cid}},(res)=>{
                    if(res.success){
                        this.setState({
                            areaone:'',
                            deletedefen:false
                        },()=>{
                            this.boundarydraw()
                        });
                    }else{
                        this.setState({
                            deletedefen:false
                        });
                    }
                })
            }else if(this.state.deleIndex===2){
                post({url:'/api/camera/fielddel',data:{key:this.state.deleIndex,code:this.state.cid}},(res)=>{
                    if(res.success){
                        this.setState({
                            areatwo:'',
                            deletedefen:false
                        },()=>{
                            this.boundarydraw()
                        });
                    }else{
                        this.setState({
                            deletedefen:false
                        });
                    }
                })
            }
        }
    };
    //删除防区弹窗取消
    deletedefenCancel=()=>{
        this.setState({
            deletedefen:false
        })
    };
    render() {
        return (
           <div className="Setarea">
                <div className="photo" id="canvasphoto">
                    <canvas id="time_graph_canvas" width="704px" height="576px"
                            style={{
                                backgroundImage: "url(" + `${this.state.src+"?t="+this.state.nowTime}` + ")",
                                backgroundSize:'100% 100%'
                            }}
                            onClick={this.clickgetcorrd} onMouseMove={this.drawmove}
                    />
                    <div className="zdefenseoper" style={{display:this.state.repaint?"flex":"none"}}>
                        <span className="zrevoke" onClick={this.hanleRepaint}>
                             <span className="zagain1" />
                             <span className="zrepaint1">重绘</span>
                        </span>
                       <span className="zrevoke" onClick={this.hanleClose}>
                            <span className="zagain2" />
                            <span className="zrepaint2">取消</span>
                       </span>
                       <span className="zrevoke" onClick={this.submitok}>
                           <span className="zagain3" />
                           <span className="zrepaint3">确定</span>
                       </span>
                    </div>
                    <div className="zsetarea">
                        <div className="optbtn">
                            <div className="zoper">
                                <span className="zoperBtn" style={{display:this.state.areaone.length>0?"none":"block"}}>
                                     <Button
                                         className={this.hanledefenBg()}
                                         onClick={()=>this.hanlAddDef(1)}
                                         disabled={this.state.defenBtn?true:false}
                                         icon="plus"
                                     >
                                    防区一
                                </Button>
                                </span>
                               <span className="zoperBtn" style={{display:this.state.areatwo.length>0?"none":"block"}}>
                                    <Button
                                        className={this.hanledefenBg()}
                                        onClick={()=>this.hanlAddDef(2)}
                                        disabled={this.state.defenBtn?true:false}
                                        icon="plus"
                                    >
                                    防区二
                                </Button>
                               </span>
                                <span className="zoperBtn zbtnRes" style={{display:this.state.areaone.length>0?"block":"none"}}>
                                    <Button
                                        type="primary"
                                        className={this.hanledeleteBg()}
                                        onClick={()=>this.hanleDeleteDef(1)}
                                        disabled={this.state.defenBtn?true:false}
                                    >
                                    <span className="zclose" />
                                    删除防区一
                                </Button>
                                </span>
                                <span className="zoperBtn zbtnRes" style={{display:this.state.areatwo.length>0?"block":"none"}}>
                                    <Button
                                        type="primary"
                                        className={this.hanledeleteBg()}
                                        onClick={()=>this.hanleDeleteDef(2)}
                                        disabled={this.state.defenBtn?true:false}
                                    >
                                    <span className="zclose" />
                                    删除防区二
                                </Button>
                                </span>
                            </div>
                            <div>
                                <Button className="base" onClick={this.changeBase} disabled={this.state.baseBtn?true:false}>更换底图</Button>
                            </div>
                        </div>
                        <div className="areaexplain">
                            <span className="circum"><span className='ference'/><span className="zmethod">围界设定方法</span>：</span>
                            <span>点击“新建防区”后在上方图片处用鼠标单击绘制防区，防区均为四边形，绘制完成后点击图片右下角的“确定”按钮即可完成防区设置。 每个设备最多可设置两处防区。</span>
                        </div>
                    </div>
                </div>
                <Modal
                   visible={this.state.deleteshow}
                   onOk={this.deleteok}
                   onCancel={this.deleteCancel}
                   cancelText='取消'
                   okText='确定'
                   width={365}
                   closable={false}
                >
                    <div style={{padding:"10px 0",color:"#999999"}}>
                        <p style={{textAlign:"center"}}><img src={policeImg} alt="" style={{width:"35px",height:"32px"}} /></p>
                        <span style={{paddingTop:"10px"}}>如果您是非专业人员对防区进行添加操作可能会因发过去不规范导致：</span>
                        <p style={{paddingTop:"10px"}}>1、导致虚警增加，增加联网报警客服对您的打扰。</p>
                        <p>2、导致漏洞增加，联网报警客服无法接受到全面的你报警信息，无法为您提供优质的安全服务。</p>
                        <p style={{textAlign:"center",color:"#000"}}>请谨慎添加！</p>
                    </div>

                </Modal>
               <Modal
                   visible={this.state.deletedefen}
                   onOk={this.deletedefenOk}
                   onCancel={this.deletedefenCancel}
                   cancelText='取消'
                   okText='确定'
                   width={365}
                   closable={false}
               >
                   <div style={{padding:"10px 0",color:"#999999"}}>
                       <p style={{textAlign:"center"}}><img src={policeImg} alt="" style={{width:"35px",height:"32px"}} /></p>
                       <p style={{textAlign:"center"}}>您需要删除防区吗？</p>
                       <p style={{paddingTop:"10px"}}>防区删除可能会导致分析设备无法正常进行区域分析工作，联网报警客服无法正常获取到您准确的防范区域，将会对您造成不你不必要的打扰。</p>
                       <p style={{textAlign:"center",color:"#000"}}>请谨慎添加！</p>
                   </div>

               </Modal>
           </div>
        )
    }

}

export default Setarea;
