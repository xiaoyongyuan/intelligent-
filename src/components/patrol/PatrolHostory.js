import React, { Component} from 'react';
import {Row,Col,Button,DatePicker,LocaleProvider,Timeline,Form,Spin,message,Modal} from "antd";
import {post} from "../../axios/tools";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../../style/sjg/home.css';
import nodata from "../../style/imgs/nodata.png";
import ing from "../../style/imgs/ing.png";
import unsucc from "../../style/imgs/unsucc.png";
import PatrolRecordModel from "./PatrolRecordModel";
import moment from "moment";
const RangePicker = DatePicker.RangePicker;
class RollcallHostory extends Component{
	constructor(props){
        super(props);
        this.state={
            activecompcode:props.auth.active.activecompanycode, //当前查看的公司
            pbdate:'',//检索的开始时间
            pedate:'',//检索的结束时间
            list:[],
            loading:true,
            page:1, //当前页数
            pageSize:20, //每页显示数量
            isrequest:true,
            loadtip:"加载中...",//下拉刷新时的提示文字
            //status  //0执行中//1已完成//2未完成
            type:true,//无数据图,
            loadtype:true,
            nodatapic:true,
        }
    }
    componentDidMount() {
        this.setState({
            loadtip:false,
        });
        this.porlist();
        this.scollbottom();
    }   
    shouldComponentUpdate=(nextProps,nextState)=>{
        if(nextProps.auth.active.activecompanycode != nextState.activecompcode){
            this.setState({
                activecompcode:nextProps.auth.active.activecompanycode,
                loading:true,
                list:[],
                page:1,
            },()=>{
                this.componentDidMount()
            }) 
        }
        return true;  
    }
    scolrequest=()=>{
        let pag=2;
        post({url:'/api/patrolresult/getlist_team',data:{pageindex:this.state.page,
            startdate:this.state.bdate?this.state.bdate:'',
            enddate:this.state.edate?this.state.edate:'',
            passivecode:this.state.activecompcode}},(res)=>{
            if(res.data.length>0){
                const list=this.state.list;
                const alist = list.concat(res.data);
                this.setState({
                     list: alist,
                     loading: false,
                     loadtip:"加载中...",
                } )
            }else{
                if(res.data.length===0){
                    message.success('没有更多了');
                    this.setState({
                        isrequest: false,
                        loadtip:false,
                        } )
                }
                
            }
        })

        
    }

scollbottom=()=>{
    var _this=this;
    let pag=1;
    document.getElementById("scorll").onscroll=function() {
        var scrollHeight = document.getElementById("scorll").scrollHeight;//div里内容的高度
        var scrollTop = document.getElementById("scorll").scrollTop;
        var clientHeight = document.getElementById("scorll").clientHeight;//div内里框框的高度
        var scrollbottom=scrollHeight-clientHeight;
        var scrollTopP=Math.ceil(scrollTop);
        _this.setState({
            scrollbottom:scrollbottom,
            scrollTop:scrollTopP
           })
        return ;
        if(scrollbottom-scrollTopP==0){//滚动到底部了
            if(pag===1){
                _this.setState({
                    loadtip:"加载中...",
               } )
            }
            pag++;
            _this.setState({
                scrollbottom:scrollbottom,
                scrollTop:scrollTop,
                page:pag
            })
            
           if(_this.state.isrequest){ 
            _this.scolrequest()
         }
        }else if(scrollbottom-scrollTopP<0){
            if(pag===1){
                _this.setState({
                    loadtip:"加载中...",
               } )
            }
            pag++;
            _this.setState({
                scrollbottom:scrollbottom,
                scrollTop:scrollTop,
                page:pag
            })
            
           if(_this.state.isrequest){ 
            _this.scolrequest()
         }
        }
    };
}

    porlist=()=>{
        post({url:'/api/patrolresult/getlist_team',data:{passivecode:this.state.activecompcode}},(res)=>{
            if(res.success){
                this.setState({
                    list:res.data,
                    loading: false,
                    type:true,
                    loadtype: false,
                })
                if(res.data.length===0){
                      this.setState({
                        nodatapic:false,
                    })
                }else{
                    this.setState({
                        nodatapic:true,
                    })
                }
            }else{
                this.setState({
                    type:false,
                })
            }
        })
    }
    backtop=()=>{ //返回顶部
        document.getElementById("scorll").scrollTop = 0; 
    };
    //开始时间
   //日期
   onChange = (date, dateString)=> {
    this.setState({
              bdate:dateString[0],
              edate:dateString[1]
          });
  }

    //禁止的开始时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
    //禁止的结束时间
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };
    onChangeDate = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    };
    //model close
    handlerollClose =()=>{
        this.setState({
            rollCallType:false
        });
    };
    handleSubmit =(e)=>{
        e.preventDefault();
        let pag=1
            const data={
                startdate:this.state.bdate?this.state.bdate:'',
                enddate:this.state.edate?this.state.edate:'',
                passivecode:this.state.activecompcode,
            }
            var oldTimestart = (new Date(this.state.bdate)).getTime()/1000;
            var oldTimeend = (new Date(this.state.edate)).getTime()/1000;
            if(oldTimeend-oldTimestart<=604800){
                this.setState({
                    loading:true,
                    list:[],
                })

              post({url:'/api/patrolresult/getlist_team',data:data},(res)=>{
                if(res.success){
                        this.setState({
                            loading:false,
                            isrequest: true,
                            list:res.data,
                            type:true,
                        })
                        if(res.data.length===0){
                            this.setState({
                                loadtip:false ,
                                type:false,
                                })
                        }
                }else{
                    this.setState({
                        type:false,
                    })
                }
            })
        }else{
            message.error('请选择七天以内的时间');
        }
       this.scollbottom();
    };
    handlerollCallType =(index,e)=>{
        if(!e) return;
        this.setState({
            rollCallType:true,
            code:index,
            itemStatus:e
        })
    };
    statepatarol =(e,item)=>{
       if(e===0){
            return "patrolnone";
       }else if(e===1){
            return "patrolblock";
       }else{
        return "patrolblock";
       }
    };
    colorline=(e)=>{
        if(e===0){
            return "#FFC125";
        }else if(e===1){
            return "green";
        }else{
         return "red";
        }
     };
     colorpic=(e)=>{
        if(e===0){
             return "yellowpic";
        }else if(e===1){
             return "greenpic";
        }else{
         return "redpic";
        }
     };
     disabledDate = (current) => {
        return current > moment().endOf('day') ;
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        return(       
            <div className="PatrolHostory scrollable-container" id="scorll" >  
              <Button onClick={this.backtop} className="backtop butBg" style={this.state.scrollTop>20?{display:'block'}:{display:'none'}}>返回顶部</Button>
                <LocaleProvider locale={zh_CN}>
                    <Row className="sear_mtop Patrol_ml" style={{marginBottom:'30px',marginLeft:'20px'}}>
                        <Form onSubmit={this.handleSubmit} layout="inline">
                            <Form.Item
                                label="日期"
                            >
                                {getFieldDecorator('range-picker1')(
                                    <RangePicker onChange={this.onChange}
                                                 disabledDate={this.disabledDate}
                                                 format="YYYY-MM-DD"
                                    />
                                )}
                            </Form.Item>
                            <Button className="queryBtn" htmlType="submit">查询</Button>
                        </Form>
                    </Row>
                </LocaleProvider>
                <div style={{marginTop:"70px",display:this.state.type?" none":"block"}}>
                    <div style={{width:"100%",textAlign:"center"}}><img src={nodata} alt="" /></div>
                </div>
                <Spin spinning={this.state.loading} className="spin" size="large" tip="加载中..." />
                <div className="timeline_ml" style={{display:this.state.type?"block":"none"}}>
                 <Timeline pending={this.state.loadtip}>
                    {
                        this.state.nodatapic?this.state.list.map((item,j)=>{
                            return (
                                <div key={j}>    
                                <Timeline.Item color={this.colorline(item.status)} >
                                    <div>
                                    <div className="inlineb"> {item.pdate} </div>
                                    {
                                        item.pteam?<div className={this.colorpic(item.status)}>{item.pteam}({item.pbdate}:00 —— {item.pedate}:00)</div>:""
                                    }
                                    <span className="xun_detail">
                                        {item.totalcount===0? <span />: <span>该班次有 {item.totalcount}个巡更点</span>} {item.status===0? <span></span>:','}
                                        <span>
                                            {item.status===1?<span>
                                               {item.handle_true===0? <span />: <span>{item.handle_true}个巡更正常 ,</span>}
                                               {item.handle_false===0? <span />: <span>{item.handle_false}个巡更异常</span>}
                                                {/* <a href={'#/app/patrol/patrolrecord?patrolid='+item.patrolid+"&pdate="+item.pdate } className="underline"> 查看详情</a> */}
                                                </span>: "" 
                                            }
                                            {item.status===2?<span>
                                                {item.unhandle===0? <span />: <span>{item.unhandle}个未巡更,</span>}
                                                {item.handle_true===0? <span />: <span>{item.handle_true}个巡更正常 ,</span>}
                                                {item.handle_false===0? <span />: <span>{item.handle_false}个巡更异常</span>}
                                                {/* <a href={'#/app/patrol/patrolrecord?patrolid='+item.patrolid+"&pdate="+item.pdate }className="underline"> 查看详情</a> */}
                                                </span>: ""
                                           }
                                        </span>
                                    </span>
                                    {item.status===0? <span style={{padding:"0 0 0 14px",color:"#FFC125"}}>执行中...</span>:''}
                                    {item.status===1? <span style={{padding:"0 0 0 14px",color:"green"}}>已完成</span>:''}
                                    {item.status===2? <span style={{padding:"0 0 0 14px",color:"red"}}>未完成</span>:''}
                                    </div>
                                    {item.info.map((num,n)=>{
                                        return (
                                            <div key={n} className="alarm_img">
                                                {item.status===0? <img src={num.ppic?num.ppic:ing} alt="alarm_img" width="100%"style={{marginBottom:'30px'}} onClick={()=>this.handlerollCallType(num.code,0)} />:''}
                                                {item.status===1? <img src={num.ppic} alt="alarm_img" width="100%"style={{marginBottom:'30px'}} onClick={()=>this.handlerollCallType(num.code,1)} />:''}
                                                {item.status===2? <img src={num.ppic?num.ppic:unsucc} alt="alarm_img" width="100%"style={{marginBottom:'30px'}} onClick={()=>this.handlerollCallType(num.code,2)} />:''}</div> 
                                            )
                                    })
                                   }
                                </Timeline.Item>
                                   
                                </div>
                            )
                        })
                        :<Row style={{marginTop:"70px"}}>
                           <Col style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></Col>
                        </Row>
                    } 
                </Timeline>
                </div>
                  <Modal
                        width={700}
                        title="巡更记录详情"
                        visible={this.state.rollCallType}
                        onCancel={this.handlerollClose}
                        footer={null}
                  >
                    <PatrolRecordModel activecompcode={this.state.activecompcode} visible={this.state.rollCallType} code={this.state.code} itemStatus={this.state.itemStatus} />
                 </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => { 
    const { auth } = state.httpData;
    return {auth};
};
export default withRouter(connect(mapStateToProps)(RollcallHostory= Form.create()(RollcallHostory)));
