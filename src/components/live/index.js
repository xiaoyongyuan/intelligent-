import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import {post} from "../../axios/tools";
import flash from "../../style/ztt/img/flash.png";
import {message} from 'antd';
var ActiveXObject=window.ActiveXObject;
var flashVis=0;//直播开关
export default class Live extends React.Component {
    constructor(props){
        super(props);
        this.state={
            id:{},
            oldTime:"",
            newTime:"",
        }
    }
    componentWillMount() {
        this.setState({
            id:this.props.query.id
        })
    }


    componentDidMount() {
        //判断浏览器是否有flash插件
        var isIE=false;
        if(window.ActiveXObject){
            isIE=true;
        }
        var has_flash=false;
        try{
            if(isIE){
                var flash=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                has_flash=true;
            }else{
                var flash=navigator.plugins["Shockwave Flash"];
                if(flash){
                    has_flash=true;
                }
            }
        }catch (e) {
            console.log(e);
        }
        if(has_flash){
            this.handleTask();
            var _this=this;
            this.player = videojs('myvideo', {
                preload: 'auto',// 预加载
                bigPlayButton: {},// 大按钮
                controls: true,// 是否开启控制栏
                width: 800,// 播放器宽度
                height: 600,// 播放器高度
                playbackRates: [1, 1.5, 2],
                muted: true, //是否循环播放
                loop : true, //是否静音
                autoplay:true, //是否自动播放
            }, function onPlayerReady() {
                if(_this.state.id){
                    this.src({
                        src: 'rtmp://39.108.188.75:1935/live/'+_this.state.id,
                        type:'rtmp/flv'
                    })
                }
            });
        }else{
            this.player = videojs('myvideo', {
                preload: 'none',// 预加载
                width: 800,// 播放器宽度
                height: 600,// 播放器高度
                playbackRates: [1, 1.5, 2],
            });
        }

  }
    //请求任务id
    handleTask=()=>{
        if(this.props.query.id){
            post({url:"/api/equipment/get_directvideo",data:{eid:this.props.query.id}},(res)=>{
                if(res.success){
                    this.setState({
                        //任务id
                        taskId:res.data,
                    },()=>{
                        this.handlePullFlow();
                    })
                }
            })
        }
    };
    //判断是否能直播
    handlePullFlow=()=>{
        if(this.state.taskId){
            post({url:"/api/smptask/getone",data:{code:this.state.taskId,apptype:1}},(res)=>{
                if(res.success){
                    if(res.data.taskstatus===0){
                        flashVis++;
                        if(flashVis>=200){
                            message.warning("直播失败!");
                            flashVis=0;
                            return false;
                        }else{
                            this.handlePullFlow();
                        }
                    }else if(res.data.taskstatus===1){
                        flashVis=0;
                        message.success(res.data.taskmemo);
                    }
                }
            })
        }
    };
  componentWillUnmount() {
      clearInterval(flashVis);
        if (this.player) {
          this.player.dispose();
        }
      //关闭
      if(this.state.taskId){
          post({url:"/api/equipment/get_directclose",data:{eid:this.props.query.id}},(res)=>{
              if(res.success){
                  message.success("关闭直播！");
              }
          })
      }
  }
  render() {
    return (
      <div>    
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js" id="myvideo" poster={flash}></video>
        </div>
        
      </div>
    )
  }
}