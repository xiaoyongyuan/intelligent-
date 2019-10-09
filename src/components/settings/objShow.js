import React, { Component } from 'react';
class objShow extends Component {
    constructor(props){
        super(props);
        this.state={
            filed:[
                {w: 139, x: 119, h: 219, y: 73, tag: 0},
                {w: 39, x: 49, h: 219, y: 73, tag: 2},
                {w: 79, x: 59, h: 219, y: 273, tag: 3},
                {w: 39, x: 249, h: 219, y: 173, tag: 1},
                {w: 139, x: 349, h: 219, y: 173, tag: 4},
            ]
        };
    }
    componentDidMount() {
       this.myCanvas();
       this.fontCanvas();
    }
    handleType=(tag)=>{
        switch (tag) {
            case 0:
                return "人";
            case 1:
                return "车";
            case 2:
                return "动物";
            case 3:
                return "树";
            case 4:
                return "摩托车";
        }
    };
    myCanvas=()=>{
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.strokeStyle = "#ECEC00";
        ctx.lineWidth="2";
        const filed=this.state.filed;
        //绘制围界
        filed.map((v)=>{
            ctx.beginPath();
            ctx.rect(v.x,v.y,v.w,v.h);
            ctx.stroke();
        })
    };
    fontCanvas=()=>{
        var c=document.getElementById("fontCanvas");
        var ctx=c.getContext("2d");
        ctx.font="16px 楷体";
        ctx.fillStyle = 'rgba(20,20,36,0.5)';
        ctx.strokeStyle = "#fff";
        const filed=this.state.filed;
        //绘制字体的画布
        filed.map((v)=>{
            ctx.beginPath();
            ctx.fillRect(v.x,v.y-22,this.handleType(v.tag).length*16+10,22);
            ctx.stroke();
        });
        //绘制字体
        filed.map((v)=>{
            ctx.strokeText(this.handleType(v.tag),v.x+4,v.y-6);
        });
        //绘制三角形
        filed.map((v)=>{
            let typeLen=this.handleType(v.tag).length*16+10;
            ctx.fillStyle = 'rgba(20,20,36,0.5)';
            ctx.beginPath();
            ctx.moveTo(v.x+typeLen, v.y-22);
            ctx.lineTo(v.x+typeLen, v.y);
            ctx.lineTo(v.x+typeLen+8, v.y);
            ctx.closePath();
            ctx.fill();
        });

    };
    render() {
        let objShow={
            position: "relative",
        };
        let labelStyle={
            position: "absolute",
        };
        return (
           <div style={objShow}>
               <canvas id="fontCanvas" width="550px" height="500px" style={labelStyle} />
               <canvas id="myCanvas" width="550px" height="500px" style={{background:"#A0A0A0"}} />
           </div> 
        )
    }

}

export default objShow;