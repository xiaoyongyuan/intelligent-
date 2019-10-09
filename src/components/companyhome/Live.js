import React, { Component } from 'react';
import {Form,Table, DatePicker,Input, Row, Col, Button,Radio, Modal,TimePicker} from 'antd';
import '../../utils/video/video.css';
import '../../utils/video/videojs.watermark.css';
import videojs from '../../utils/video/video.js';


class Live extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        // instantiate video.js

    // this.player = window.videojs(this.videoNode, this.props, function onPlayerReady() {
    //   console.log('onPlayerReady', this)
    // });
    // window.player = this.player;
    }

  
  componentWillUnmount() {
    // if (this.player) {
    //   this.player.dispose()
    // }
  }
    render() {
        {/*const player = videojs('example_video',{
            muted: true,
            loop : true,
            width: 1080,
            height:768,
            autoplay :true,
        },
        function onPlayerReady(){
            this.src({
                src: 'rtmp://192.168.1.19/live/stream2',
                type:'rtmp/flv'
            })
        });*/}
        
        return (
            <div className="living" style={{width:"600px",height:"300px"}}>
                {/*<div data-vjs-player>
                    <video ref={ node => this.videoNode = node } className="video-js"></video>
                </div>


                <video id="example_video" className="video-js vjs-default-skin" controls preload="auto"  data-setup="{}">
                    <source src="rtmp://192.168.1.19/live/stream2" type='rtmp/flv' />
                </video>*/}
            </div>
        )
    }
}
export default Live;
