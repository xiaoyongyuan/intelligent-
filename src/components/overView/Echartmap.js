import React, { Component , Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import xianmap from "../../style/ztt/map/xianmap";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { changeComp } from '@/action'; //action->index按需取

class Echartmap extends Component {
    constructor(props){
        super(props);
        this.state= {
            father:{},
            option:{},
            type:'',
            width:'400px',
            height:'300px',
            mapValue:[],
            mapJson:{}
        }
    }
    componentWillMount(){
        this.setState({
            type:this.props.type
        })
    };
    componentDidMount(){
        if(this.state.type=='xianmap'){
            this.setState({
                mapValue:this.props.mapValue,
                mapJson:this.props.mapJson,
                cnameMap:this.props.cnameMap
            })
        }
        
    };
    onByModelClick = (e)=>{
         if(e.componentType === "series"){
             if(e.name!=this.props.cnameMap){
                 for(var i=0;i<this.state.mapValue.length;i++){
                     if(e.name===this.state.mapValue[i].name){
                        var code=this.state.mapValue[i].code;
                     }
                 }
                const data={
                    activecomp:e.name,
                    activecompanycode:code,  
                }
                const { changeComp } = this.props;
                changeComp(data)
                this.props.history.push('/app/companyhome/index')
             }
         }
    };
    onClickByModel={
        'click':this.onByModelClick
    }
    shouldComponentUpdate(next,state){
        if(next.mapValue.length !==state.mapValue.length){
            this.setState({
                mapValue:next.mapValue,
            })
            return true;
        }else return false;
    }
    xianmap=()=>{ //地图
        echarts.registerMap('xian', xianmap);
         var geoCoordMap=this.props.mapJson;
        var goData =this.props.mapValue;
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        function formtGCData(geoData, data, srcNam, dest) {
            var tGeoDt = [];
            if (dest) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (srcNam != data[i].name) {
                        tGeoDt.push({
                            coords: [geoData[srcNam], geoData[data[i].name]]
                        });
                    }
                }
            } else {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (srcNam != data[i].name) {
                        tGeoDt.push({
                            coords: [geoData[data[i].name], geoData[srcNam]]
                        });
                    }
                }
            }
            return tGeoDt;
        }
        function formtVData(geoData, data, srcNam) {
            var tGeoDt = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var tNam = data[i].name
                if (srcNam != tNam) {
                    tGeoDt.push({
                        name: tNam,
                        value: geoData[tNam]
                    });
                }

            }
            tGeoDt.push({
                name: srcNam,
                value: geoData[srcNam],
                symbolSize: 8,
                itemStyle: {
                    normal: {
                        color: '#F29E2E',
                        borderColor: '#F29E2E'
                    }
                }
            });
            return tGeoDt;
        }
        let option={
            background:"#091e57",
            geo: {
                map: 'xian',
                roam: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: '#80D6EB' },{ offset: 1, color: '#3B80B4' }]
                        )}
                },
                aspectScale:.8, //长宽比
                zoom:1.2, //当前视角的缩放比例
                //取消鼠标移入地图上的文字
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle:{
                    normal:{
                        areaColor:"#091E57", //地图的背景
                        borderColor:"#0EF1F4" //分界线的颜色
                    },
                    emphasis:{
                        areaColor:"#091E57" //悬浮时的颜色
                    },
                }
            },
            series: [{
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.1,
                    color: '#f4e925',
                    symbol: planePath,
                    symbolSize: 8
                },
                lineStyle: {
                    normal: {
                        color: '#f4e925',
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: formtGCData(geoCoordMap, goData, this.props.cnameMap)
            },
                {

                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.1,
                        symbol: planePath, //标记类型
                        symbolSize: 10
                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2, //弧线角度
                            color: '#f4e925'
                        }
                    },
                    data: formtGCData(geoCoordMap, goData, this.props.cnameMap)
                },
                {

                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        period: 4,
                        scale: 2.5,
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            borderColor: 'gold'
                        }
                    },

                    data: formtVData(geoCoordMap, goData, this.props.cnameMap)
                }]
        }
        return option
    }
    render() {
        return (
            <Fragment>
            {this.props.mapValue.length
                ?<ReactEcharts
                    option={this.xianmap()}
                    style={{height:this.props.winhe+'px',width:"100%"}}
                    onEvents={this.onClickByModel}
                /> 
                :''
            }
            
            </Fragment>
        )
    }
}
const mapStateToProps = state => {
    const { responsive = {data: {}} ,auth } = state.httpData;
    return {responsive, auth};
};

const mapDispatchToProps = dispatch => ({
    changeComp: bindActionCreators(changeComp, dispatch),
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Echartmap));
