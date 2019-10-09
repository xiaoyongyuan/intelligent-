import React, { Component} from 'react';
import {Row, Button, DatePicker, LocaleProvider, Timeline , Form,Modal,Spin,message} from "antd";
import {post} from "../../axios/tools";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../../style/sjg/home.css';
import RollcallRecordModel from "./RollcallRecordModel";
import nodata from "../../style/imgs/nodata.png";
import err from "../../style/imgs/err.png";
import moment from "moment";
const RangePicker = DatePicker.RangePicker;
class RollcallHostory extends Component{
	constructor(props){
        super(props);
        this.state={
            activecompcode:props.auth.active?props.auth.active.activecompanycode:'', //当前查看的公司
            bdate:'',//检索的开始时间
            edate:'',//检索的结束时间
            rollCallType:false,
            list:[],
            dataitem:{},
            loading:true, //加载中的状态
            page:1, //当前页数
            pageSize:20, //每页显示数量
            isrequest:true,//是否请求接口
            scrollTop:Number,
            loadtip:"加载中...",//下拉刷新时的提示文字
            type:true,//无数据图
            sou:false,
        }
    }
    componentDidMount() {
        this.setState({
            loadtip:false,
        })
        this.rolList();
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
    scollbottom=()=>{
        var _this=this;
        let pag=2;
        document.getElementById("scorll").onscroll=function() {
            var scrollHeight = document.getElementById("scorll").scrollHeight;//div里内容的高度
            var scrollTop = document.getElementById("scorll").scrollTop;//0-18
            var clientHeight = document.getElementById("scorll").clientHeight;//div内里框框的高度
            var scrollbottom=scrollHeight-clientHeight;
            var scrollTopP=Math.floor(scrollTop);
           
            _this.setState({
                scrollbottom:scrollbottom,
                scrollTop:scrollTop
               },()=>{
                }
               )  
            return ;                       
            if(scrollbottom-scrollTopP==0){//滚动到底部了
               _this.setState({
                scrollbottom:scrollbottom,
                scrollTop:scrollTop,
                page:pag
               })
               if(_this.state.isrequest){ 
                post({url:'/api/rollcalldetail/getlist_info_dayly',
                data:{
                    pageindex:_this.state.page,
                    daylybdate:_this.state.bdate?_this.state.bdate:'',
                    daylyedate:_this.state.edate?_this.state.edate:'',
                    passivecode:_this.state.activecompcode}
                },(res)=>{
                    if(res.data.length>0){
                            pag++;
                            const list=_this.state.list;
                            const alist = list.concat(res.data);
                            _this.setState({
                                 list: alist,
                                 loading: false,
                                 loadtip:"加载中...",
                            } )
                    }else{
                        if(res.data.length===0){
                            message.success('没有更多了');
                            _this.setState({
                                isrequest: false,
                                loadtip:false,
                                } )
                        }
                    }
                })
             }
              
            }else if(scrollbottom-scrollTopP<0){
                _this.setState({
                    scrollbottom:scrollbottom,
                    scrollTop:scrollTop,
                    page:pag
                   })
                   if(_this.state.isrequest){ 
                    post({url:'/api/rollcalldetail/getlist_info_dayly',
                    data:{
                        pageindex:_this.state.page,
                        daylybdate:_this.state.bdate?_this.state.bdate:'',
                        daylyedate:_this.state.edate?_this.state.edate:'',
                        passivecode:_this.state.activecompcode}
                    },(res)=>{
                        if(res.data.length>0){
                                pag++;
                                const list=_this.state.list;
                                const alist = list.concat(res.data);
                                _this.setState({
                                     list: alist,
                                     loading: false,
                                     loadtip:"加载中...",
                                } )
                        }else{
                            if(res.data.length===0){
                                message.success('没有更多了');
                                _this.setState({
                                    isrequest: false,
                                    loadtip:false,
                                    } )
                            }
                            
                        }
                       
                    })
                 }
            }
        }
    }
    handleSubmit =(e)=>{
        let pag=1
        e.preventDefault();
            const data={
                daylybdate:this.state.bdate?this.state.bdate:'',
                daylyedate:this.state.edate?this.state.edate:'',
                passivecode:this.state.activecompcode,
                pageindex:pag,
            }
            var oldTimestart = (new Date(this.state.bdate)).getTime()/1000;
            var oldTimeend = (new Date(this.state.edate)).getTime()/1000;
            if(oldTimeend-oldTimestart<=604800){
                this.setState({
                    loading:true,
                    list:[],
                    sou:true,
                })
            post({url:'/api/rollcalldetail/getlist_info_dayly',data:data},(res)=>{
                if(res.success){
                    if(res.data.length===0){
                        this.setState({
                            type:false,
                        })
                    }
                    if(res.data.length>0){
                        this.setState({
                            type:true,
                        })
                    }
                    this.setState({
                        isrequest: true,
                        list:res.data,
                        loading:false,
                    })
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
 rolList =()=>{
        post({url:'/api/rollcalldetail/getlist_info_dayly',data:{passivecode:this.state.activecompcode}},(res)=>{
            if(res.success){
                if(res.data.length===0){
                    this.setState({
                        type:false
                    })
                }
                if(res.data.length>0){
                    this.setState({
                        type:true,
                    })
                }
                this.setState({
                  list:res.data,
                  loading: false,
                });
            }else{
                this.setState({
                    type:false,
                })
            }
        })
    };
    backtop=()=>{ //返回顶部
        document.getElementById("scorll").scrollTop = 0; 
    };
    //日期
    onChange = (date, dateString)=> {
      this.setState({
                bdate:dateString[0],
                edate:dateString[1]
            });
    }
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

    //model open
    handlerollCallType =(index)=>{
        this.setState({
            rollCallType:true,
            code:index
        })
    };
    //model close
    handlerollClose =()=>{
        this.setState({
            rollCallType:false
        })
    };
    disabledDate = (current) => {
        // return current > moment().startOf('day') || current > moment().subtract(-1, 'day') ;
        return current > moment().endOf('day');
    };
    render(){
       
        const { getFieldDecorator } = this.props.form;
        return(       
            <div className="RollcallHostory scrollable-container" id="scorll" >  
              <Button className="backtop butBg" onClick={this.backtop} style={this.state.scrollTop>20?{display:'block'}:{display:'none'}}>返回顶部</Button>
                <LocaleProvider locale={zh_CN}>
                    <Row className="sear_mtop Patrol_ml"style={{marginBottom:'30px',marginLeft:'20px'}}>
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
                  <Spin spinning={this.state.loading} size="large" className="spin" tip="加载中..." />
                <div style={{marginTop:"70px",display:this.state.type?" none":"block"}}>
                    <div style={{width:"100%",textAlign:"center"}}><div className="backImg"><img src={nodata} alt="" /></div></div>
                </div>
                <div className="timeline_ml" style={{display:this.state.type?" block":"none"}}>
                 <Timeline pending={this.state.loadtip}>
                    {
                        this.state.list.map((item,j)=>{
                            return (

                                <div key={j}>

                                <Timeline.Item color="#fff">
                                    <p> {item.dayly} </p>
                                     {
                                         item.info.map((el,i)=>{
                                            return (
                                                <div key={i}>
                                                    {/* <div className="times"> 第{i+1}次</div> */}
                                                        <div className="line_detail">
                                                            <div className="line_alerm">
                                                               <div>
                                                                   {
                                                                       el.alarm.length>0?
                                                                           <div className="circle"><div /></div>
                                                                           :
                                                                           <div className="circlegreen"><div /></div>
                                                                   }
                                                               </div>
                                                                    <div className="m_l">
                                                                        <div className="arr">{el.rollcalldate.slice(11,20)}</div>　
                                                                        <span>
                                                                            {el.ifeveryday===0?"自动点名":"手动点名"}，
                                                                            共点名 {el.totalcount}个对象，
                                                                        </span>
                                                                        {el.executing?<span>{el.executing}个正在点名.</span>: ''}
                                                                        {el.rollcallalarm?<span>{el.rollcallalarm}个报警.</span>: ''}
                                                                        {el.normal?<span>{el.normal}个正常.</span>: ''}
                                                                        {el.totalcount-el.executing-el.normal-el.rollcallalarm?<span>{el.totalcount-el.executing-el.normal-el.rollcallalarm}个失败.</span>: ''}                                                                       
                                                                    </div>
                                                            </div>
                                                            {
                                                            el.alarm.map((num,n)=>{
                                                                 return (
                                                                            <div key={n} className="alarm_img" style={num.rpic?{display:'inlin-block'}:{display:'none'}} >
                                                                                <img src={num.rrpic?num.rrpic:err} alt="alarm_img" width="100%" style={num.rfinal==2?{border:"1px solid #f00"}:{border:'none'}}  onClick={()=>this.handlerollCallType(num.code)} />
                                                                            </div>
                                                                        )
                                                                })
                                                            }
                                                        </div>
                                                </div>
                                               )
                                        })
                                        }
                                </Timeline.Item>
                                </div>
                            )
                        })
                    }
                </Timeline>
                </div>
                 <Modal
                    width={700}
                    title="点名记录详情"
                    visible={this.state.rollCallType}
                    onCancel={this.handlerollClose}
                    footer={null}
                 >
                    <RollcallRecordModel activecompcode={this.state.activecompcode} code={this.state.code} visible={this.state.rollCallType} rollcallhostory="1" />
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

