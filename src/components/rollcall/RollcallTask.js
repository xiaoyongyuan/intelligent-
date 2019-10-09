import React, { Component} from 'react';
import {Row, Col, Button,Form, Input, Modal, Card, Icon, Select, message, Spin, Pagination} from "antd";
import {post} from "../../axios/tools";
import "../../style/ztt/css/rollCall.css";
import RollcallRecordModel from "./RollcallRecordModel";
import noImg from "../../style/imgs/nopic.png";
import scan from "../../style/imgs/scan.gif";
import nodata from "../../style/imgs/nodata.png";
import moment from "moment";
import "../../style/publicStyle/publicStyle.css";
const Option = Select.Option;
const FormItem = Form.Item;

class RollcallTask extends Component{
	constructor(props){
        super(props);
        this.state={
            state:1, //当前任务的状态
            time:0, //日执行次数
            last:{}, //上次点名
            count:20,
            normal:18,
            unusual:2,
            list:[],
            settingType:false,
            loading:true, //加载开关
            everynum:1, //点名任务次数
            rname:'', //检索的字段-对象名称
            cameraname:'', //检索的字段-设备名称
            pageindex:1, //当前页
            pageSize:9, //每页显示的数据
            duration:'',
       
        }
    }
    componentDidMount() {
        post({url:"/api/rollcalltask/getlasttask"},(res)=>{
            if(res.success){
                this.setState({
                    time:res.task.rollcallnum, //当日点名次数
                    last:res.last, //上次点名
                    loading:false,
                },()=>{
                    this.draw()
                })
            }
        })
        this.reuestdata();
    }
    //modal open
    handleSetting =()=>{
	    this.setState({
            settingType:true
        })
    };
	//model close
    handleCancelSetting =()=>{
        this.setState({
            settingType:false
        })
    };
    // model ok
    handleOkSetting =()=>{
        this.setState({
            settingType:false
        });
        post({url:"/api/rollcalltask/add",data:{rollcallnum:this.state.everynum}},(res)=>{
            if(res.success){
                message.success(res);
            }
        });
    };
    rollTaskChange =(value)=>{
        this.setState({
            everynum:value
        });
    };
    //名称
    handleRealname =(e)=>{
        this.setState({
            realname:e.target.value
        })
    };
    //设备
    handleAccount =(e)=>{
        this.setState({
            account:e.target.value
        })
    };
    rollcall=(rid,index)=>{ //手动点名
        this.setState({
            loading:false,
        })	
    	post({url:"/api/rollcalltask/add_manualforAPP",data:{rid:rid}},(res)=>{
        if(res.success){
        	if(rid==='all'){ //全部点名
        		this.props.history.push('/app/companyhome/calling?id='+res.code)
        	}else{ //单点
                let duration=moment().format('YYYY-MM-DD HH:mm:ss');
                let list=this.state.list;
                list[index].scan=true;
        		this.setState({
    	            loading:false,
    	            code:res.code,
                    list:list,
                    index:index,
                    duration:duration,
	        	},()=>{
	        		this.rollcallresult()
	        	})	
        	}    
        }
      })
    }
    rollcallresult =()=>{ //查询点名结果
        this.setState({
            loading:false,
         
        }) 
    	const _this=this;
    	let inter=setInterval(function(){
            let list=_this.state.list;
            list[_this.state.index].scan=false;
            if(moment()-moment(_this.state.duration)>10000){ //点名10秒无结果
                message.warn('系统繁忙，请稍后再试');
                clearInterval(inter);
                _this.setState({
                    loading:false,
                    list:list,
                }) 
                return;
            }
    		post({url:"/api/rollcalldetail/getlist_bytask",data:{taskid:_this.state.code},type:1},(res)=>{
            if(res.success){
                if(!res.unhandle){
                   clearInterval(inter);
                   _this.setState({
                        code:res.data[0].code,
                        loading:false,
                        rollCallType:true,
                        list:list,
                    }) 
                }
                
            }else{
                clearInterval(inter);
            }
        })
    	},2000)
    };
    //点名查询
    selectopt =(e)=>{
        e.preventDefault()
        this.setState({
            rname:this.state.realname,
            cameraname:this.state.account,
            pageindex:1,

            loading:true,

        },()=>{
            this.reuestdata()
        })
    };
    hanlePageSize = (page) => { //翻页
        this.setState({
            pageindex:page
        },()=>{
            this.reuestdata();
        })
    };
    handlerollClose=()=>{ //控制单个点名弹层关闭
    	this.setState({
        rollCallType:false
      })
    }
    draw = () => { //画对象区域   
        let ele = document.getElementsByTagName("canvas");
        if(ele.length){
            for (let x = 0; x < ele.length; x++) {
                let item=JSON.parse(this.state.list[x].rzone);
                let that=ele[x];
                let area = that.getContext("2d");
                area.strokeStyle='#f00';
                area.lineWidth=1;
                area.beginPath();
                area.moveTo(parseInt(item[0][0]/2.6),parseInt(item[0][1]/2.6));
                item.map((elx,i)=>{
                    if(i>0){
                       area.lineTo(parseInt(item[i][0]/2.6),parseInt(item[i][1]/2.6));
                       if(i===3){
                       area.lineTo(parseInt(item[0][0]/2.6),parseInt(item[0][1]/2.6));
                       } 
                       area.stroke();
                    }
                    return '';
                })
            }
        }        
    }
    reuestdata =()=>{ //点名的对象list
        let params={
            rname:this.state.realname,
            cameraname:this.state.account,
            pageindex:this.state.pageindex
        }
        post({url:"/api/rollcall/getlist",data:params},(res)=>{
            if(res.success){
                this.setState({
                    list:res.data,
                    totalcount:res.totalcount,
                    loading:false,
                },()=>{
                    this.draw()
                })
            }
        })
    };
    deleteCancel=()=>{ //删除弹层关闭
        this.setState({
            code:'',
            index:'',
            deleteshow:false,
        })
    }
    deleteOk=()=>{//删除点名对象
        const list=this.state.list;
        list.splice(this.state.index,1);
        post({url:"/api/rollcall/del",data:{code:this.state.code}},(res)=>{
          if(res.success){
            message.success('删除成功')
            this.setState({
                list:list,
                deleteshow:false,
            },()=>{
                this.draw()
            })
          }
      })

    }
    deleteobj=(code,index)=>{ //删除弹层
        this.setState({
            code:code,
            index:index,
            deleteshow:true,
        })
    }
    
    render(){
        const { getFieldDecorator } = this.props.form;
        const ishideOnSinglePage = true;
        const isdisabled = true;
        return(       
            <div className="RollcallTask">
                <Row style={{margin:"2vmax 1vmax"}}>
                    <Col span={24}>
                        <Card title="点名任务" extra={<span onClick={this.handleSetting} style={{ cursor:"pointer" }} > <Icon type="setting" theme="filled"style={{color:'#fff'}} /><span style={{color:'#fff'}}>设置</span></span>}>
                            <p>今日自动点名次数: <b>{this.state.time}</b>次 &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; {this.state.state?'执行中':'待生效'}</p>
                            {this.state.last.rollcalldate
                                ?<div>{this.state.last.executing<=0
                                    ?<p>上一次点名时间: {this.state.last.rollcalldate} &nbsp; &nbsp;&nbsp; 共点名<b>{this.state.last.totalcount}</b>个对象，<b>{this.state.last.normal?this.state.last.normal:'0'}</b>个正常， <b>{this.state.last.unusual?this.state.last.unusual:'0'}</b>个报警</p>
                                    :<p>上一次点名时间: {this.state.last.rollcalldate} &nbsp; &nbsp;&nbsp; 点名中</p>}
                                </div>
                                :''}
                        </Card>
                    </Col>
                </Row>
                <Row style={{margin:"1vmax 1vmax"}}>
                    <Col span={14}>
                        <Form layout="inline" onSubmit={this.selectopt}>
                            <FormItem label="对象名">
                                {getFieldDecorator('realname', {
                                    rules:[{
                                        required: false,
                                        message: '请输入名称!'
                                    }],
                                })( 
                                    <Input onChange={this.handleRealname} />
                                )}
                            </FormItem>
                            <FormItem label="设备">
                                {getFieldDecorator('account', {
                                    rules: [{
                                        required: false,
                                        message: '请输入设备!',
                                    }],
                                })(
                                    <Input onChange={this.handleAccount} />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button className="butBg queryBtn" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={2}>
                        <a href="#/app/rollcall/adopt"><Button className="queryBtn">新增</Button></a>
                    </Col>
                    <Col span={2}>
                        <Button className="processingBtn" onClick={()=>this.rollcall('all')}>全部点名</Button>
                    </Col>
                </Row>
                {/* <Spin size="large" spinning={this.state.loadding} tip="Loading..." className="loadding" /> */}
                <Spin spinning={this.state.loading} size="large" className="spin" tip="记载中..." />

                <div className="flexbox">
                    {!this.state.list.length?<div style={{width:"100%",textAlign:"center",marginTop:'80px'}}><div className="backImg"><img src={nodata} alt="" /></div></div>:this.state.list.map((el,i)=>(
                        <div className="cardflex" key={i+1} style={{margin:"1vmax 1vmax"}}>
                            <Card>
                                <h4 style={{textAlign:'center',fontSize:"1max",color:'#fff'}}>{el.rname}<Icon type="delete" style={{float:'right'}} onClick={()=>this.deleteobj(el.code,i)} /></h4>
                                <div className="cardContext">
                                    <a className="scan" href={"#/app/rollcall/adoptlook?id="+el.code}>
                                        <canvas id={"canvas"+(i+1)} width="270px" height="221px" style={el.fieldpath?{backgroundImage:'url('+el.fieldpath+')'}:{backgroundImage:'url('+noImg+')'}} />
                                        <img src={scan} className={el.scan?"scangif":"scanno"} alt="" />
                                    </a>
                                    <div className="titles">{el.cameraname}</div>
                                </div>

                                {el.detail[0]
                                    ?
                                    <p>{el.detail[0].resultdate}
                                        {el.rstatus===1
                                            ? <span style={{float:"right"}}>正常</span>
                                            : <span style={{float:"right",color:'#f00'}}>报警</span>}
                                    </p>
                                    : <p>暂无点名记录  </p>
                                }

                                {el.rhandle===1&&el.rstatus? <Button type="primary"className="queryBtn" block onClick={()=>this.rollcall(el.code,i)} visible={el.rstatus} disabled={false}>点名</Button>:''}
                                {el.rhandle===1&&el.rstatus? '':<Button type="primary"block onClick={()=>this.rollcall(el.code,i)} visible={el.rstatus} disabled={isdisabled}>点名</Button>}
                                {/* <Button type="primary"className="queryBtn" block onClick={()=>this.rollcall(el.code,i)} visible={el.rstatus} disabled={el.rhandle===1&&el.rstatus?false:true}>点名</Button> */}
                            </Card>
                        </div>
                    ))}
                </div>
                <Pagination hideOnSinglePage={ishideOnSinglePage} current={this.state.pageindex} total={this.state.totalcount} pageSize={this.state.pageSize} onChange={this.hanlePageSize} className="pageSize" />
              {/* </Spin> */}
                <Modal
                    title="设置点名任务"
                    visible={this.state.settingType}
                    onOk={this.handleOkSetting}
                    onCancel={this.handleCancelSetting}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form layout="inline" className="setrollcalltask">
                        <Form.Item
                            label="日点名次数"
                        >
                            {getFieldDecorator('residence',{
                                initialValue:"1"
                            } )(
                                <Select style={{ width: 120 }} onChange={this.rollTaskChange}>
                                    <Option value="1" >1</Option>
                                    <Option value="2" >2</Option>
                                    <Option value="3" >3</Option>
                                    <Option value="4" >4</Option>
                                    <Option value="6" >6</Option>
                                    <Option value="8" >8</Option>
                                    <Option value="12">12</Option>
                                    <Option value="24">24</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                width={700}
                title="点名记录详情"
                visible={this.state.rollCallType}
                onCancel={this.handlerollClose}
                footer={null}
                >
                    <RollcallRecordModel code={this.state.code} visible={this.state.rollCallType} />
                </Modal>
                <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                       onCancel={this.deleteCancel} okText="确认" cancelText="取消"
                >
                    <p>确认删除吗？</p>
                </Modal>
            </div>
        )
    }
}

export default RollcallTask=Form.create()(RollcallTask);
