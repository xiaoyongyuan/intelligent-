import React, { Component } from 'react';
import { Menu, Icon, Layout, Popover,Modal, Select, notification,message} from 'antd';
import screenfull from 'screenfull';
import GoEasy from '../utils/goeasy';
import icon_admin from '../style/imgs/icon_admin.png';
import icon_user from '../style/imgs/icon_user.png';
import SiderCustom from './SiderCustom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {post} from "../axios/tools";
import "../style/publicStyle/publicStyle.css"
import "../style/yal/css/overView.css";
import { changeComp,alarmMax,clearAuth } from '@/action'; //action->index按需取

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;
let vis=false;
//goeasy消息推送
// eslint-disable-next-line
const goEasy = new GoEasy({
    appkey: "BC-f8cc95fa01994d4683de1bafffe9c9ac",
    onConnected: function () {
        console.log("成功连接GoEasy。");
    },
    onDisconnected: function () {
        console.log("与GoEasy连接断开。");
    },
    onConnectFailed: function (error) {
        console.log("与GoEasy连接失败，错误编码："+error.code+"错误信息："+error.content);
    }
});
class HeaderCustom extends Component {
    state = {
        user: {},
        visible: false,
        complist:[],
        activecompanycode:'',
        activecname:'',
    };
    componentDidMount() {
        const _user = JSON.parse(localStorage.getItem('user'));
        if(!_user){
            this.props.history.push('/login');
        }else{
            
            
            //this.goEasyinit('17792542304')

            this.setState({
                user: _user,
            });
        }
    };
    goEasyinit(uid){ //goeasy消息

        goEasy.subscribe({
            channel:uid,
            onMessage: function (message) {
                console.log('messagemessage',message)
                        },
            onSuccess: function () {
                    console.log("Channel订阅成功。");

                       },
            onFailed: function (error) {
                    console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
                    }
        });
    }
    shouldComponentUpdate=(nextProps,nextState)=>{
        if(nextState.alarmmax && nextProps.auth.alarmmax != nextState.alarmmax){
            this.openNotification()
        }
        return true;  
    }
    screenFull = () => { //全屏切换
        screenfull.toggle();
        this.props.toggle();
    };
    menuClick = e => {
        e.key === 'logout' && this.logout();
    };
    showModaldelete = () =>{ //退出
        this.setState({
            deleteshow: true,
        });
    }
    sitchcomp=()=>{ //打开切换公司弹层
        const _this=this;
        if(!this.state.complist.length){
             post({url:'/api/sharinginfo/get_active'},function(res){
                if(res.success){
                    _this.setState({
                        complist:res.data
                    }); 
                }
             }) 
        }
        
        this.setState({
            sitchshow: true,
        });
    }
    switchCancel=()=>{ //关闭切换公司弹层
        this.setState({
            sitchshow: false,
        });
    }
    handleOnekey=(value)=>{ //切换公司-选择公司
        this.setState({
            activecode: value,
        });
    }
    callaction=(num)=>{  //调取action-报警数变化
        const { alarmMax } = this.props;
            alarmMax(num)
    }
    switchput=()=>{ //切换公司确认提交
        const _this=this,auth=this.props.auth;
        var data={},activecomp='';
        if(this.state.activecode!='onself'&& this.state.complist){
            data={
                activecomp:this.state.complist[this.state.activecode].passivename,
                activecompanycode:this.state.complist[this.state.activecode].passivecode,  
            }
            activecomp=data.activecomp;

            
        }else if(this.state.activecode='onself'){
            data={
                activecomp:'',
                activecompanycode:'',  
            }
            activecomp=auth.data.cname;
        }
        const { changeComp } = this.props;
        changeComp(data)
        this.setState({
            sitchshow: false
        },()=>{
            message.success('您已成功切换到'+activecomp)
        })
        return;
        //将切换的公司存入localStorage中，已废弃
        if(this.state.activecode=='onself'){
            this.setState({
                activecname:_this.state.cname,
                activecompanycode:'',
                sitchshow: false,
            },()=>{
                localStorage.setItem('activecompcode','');
                localStorage.setItem('activecomp','');
                window.location.reload();
            });
        }else if(this.state.activecode=='onself'){
            this.setState({
                activecname:this.state.complist[this.state.activecode].passivename,
                activecompanycode:this.state.complist[this.state.activecode].passivecode,
                sitchshow: false,
            },()=>{
                localStorage.setItem('activecompcode',this.state.activecompanycode);
                localStorage.setItem('activecomp',this.state.activecname);
                window.location.reload();
            });
        }
        
    }
    deleteOk = () =>{//确认退出
        const { clearAuth } = this.props;
            clearAuth()
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.props.history.push('/login')
    };
    deleteCancel = () =>{//取消退出
        this.setState({
            deleteshow: false,
        });
    };
    logout = () => { //退出
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.props.history.push('/login')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };

    openNotification = () => { //报警消息提醒
        notification.open({
            key:'newalarm',
            message: '信息',
            description: (
              <div>
                  您有新的报警信息
              </div>
          ),
          icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
          duration: 1,
          placement:'bottomRight'
        });
    };
    render() {




        const { responsive, path, auth } = this.props;
        const _this=this;        
        return (
            <div style={{background:'#313653'}}>
            <Modal
                title="消息提醒"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
            />
            <Header className="custom-theme header">
                <div className="titletop">
                    <div className="titlevalue">
                        {this.props.user.cname}
                    </div>
                </div>

                <div style={{width:"15%",float:"left"}} className="leftIcon">
                    {
                        responsive.data.isMobile ? (
                            <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                                <Icon type="bars" className="header__trigger custom-trigger" />
                            </Popover>
                        ) : (
                            <Icon
                                className="header__trigger custom-trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.props.toggle}
                            />
                        )
                    }
                </div>
                <div style={{width:"28%",float:"right"}}>
                    {/*当前查看公司*/}
                    <div style={{ lineHeight: '63px', float: 'right',color:'#fff' }}>当前单位：{auth&&auth.active&&auth.active.activecomp?auth.active.activecomp:this.props.user.cname}</div>
                    <Menu
                        mode="horizontal"
                        style={{ lineHeight: '63px', float: 'right' }}
                        onClick={this.menuClick}
                    >
                        <Menu.Item style={{borderBottom:'2px solid #31365'}} key="full" onClick={this.screenFull} >
                            <Icon type="arrows-alt" onClick={this.screenFull} />
                        </Menu.Item>
                        <SubMenu style={{borderBottom:'2px solid #31365'}} title={<span className="avatar"><img src={this.props.user.utype==='1'?icon_user:icon_admin} alt="头像" /> </span>}>
                            <MenuItemGroup title="用户中心" style={{background:"rgba(255,255,255,0.5)"}}>
                                <Menu.Item key="setting:1">你好 - {this.props.user.realname}</Menu.Item>
                                {this.props.user.activecount
                                    ?<Menu.Item key="setting:2" onClick={this.sitchcomp}>{auth.active&&auth.active.activecomp?auth.active.activecomp:this.props.user.cname} <Icon type="sync" /></Menu.Item>
                                    :''
                                }
                                <Menu.Item key="logoutto" onClick={this.showModaldelete}><span>退出登录</span></Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </div>
            </Header>

            <Modal title="提示信息" visible={this.state.deleteshow} onOk={this.deleteOk}
                   width={370}
                onCancel={this.deleteCancel}
                okText="确认"
                cancelText="取消"
            >
            <p>确认退出吗？</p>
            </Modal>
            <Modal title="切换单位" visible={this.state.sitchshow} onOk={this.switchput}
                   width={370}
                onCancel={this.switchCancel}
                okText="确认"
                cancelText="取消"
            >
                <div>
                           选择单位：
                    <Select defaultValue="请选择单位" style={{ width: 180 }} onChange={this.handleOnekey}>
                        <Option value={'onself'} key={'x'}>{this.props.user.cname}</Option>
                        {
                        this.state.complist.map((v,i)=>(
                            <Option value={i} key={v}>{v.passivename}</Option>
                        ))
                        }
                    </Select>
                </div>
            </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { responsive = {data: {}} ,auth } = state.httpData;
    return {responsive, auth};
};

const mapDispatchToProps = dispatch => ({
    changeComp: bindActionCreators(changeComp, dispatch),
    alarmMax: bindActionCreators(alarmMax, dispatch),
    clearAuth:bindActionCreators(clearAuth, dispatch)

});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(HeaderCustom));
