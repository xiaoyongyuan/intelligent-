import React, { Component } from 'react';
import '../../utils/video/video.css';
import videojs from '../../utils/video/video.js';


class Live extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        // instantiate video.js

    this.player = window.videojs('myvideo', this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
      this.src({
        src: 'http://www.w3school.com.cn/i/movie.mp4',
        type:'video/mp4'
      })
    });
    // window.player = this.player;






    }

  
  componentWillUnmount() {
    // if (this.player) {
    //   this.player.dispose()
    // }
  }
    render() {
        
        return (
            <div className="living" style={{width:"600px",height:"300px"}}>
                <div data-vjs-player>
                    <video ref={ node => this.videoNode = node } className="video-js" id="myvideo"></video>
                </div>


                {/*<video id="example_video" className="video-js vjs-default-skin" controls preload="auto"  data-setup="{}">
                    <source src="rtmp://192.168.1.19/live/stream2" type='rtmp/flv' />
                </video>*/}
            </div>
        )
    }
}
export default Live;
