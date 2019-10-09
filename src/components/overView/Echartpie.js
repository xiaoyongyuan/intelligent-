import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
require('echarts/map/js/china.js');
class Echartpie extends Component {
    constructor(props){
        super(props);
        this.state= {
            father:{},
            option:{},
            type:'rollcall',
            width:'400px',
            height:'300px',
        }
    }
    componentWillMount(){
        this.setState({
            type:this.props.type
        })
    }
    componentDidMount(){
        this[this.state.type]()
    }
    componentWillReceiveProps(nextProps){
        if(nextProps!==this.state.father){
            this.setState({
                father:nextProps
            },()=>{                
                this.componentDidMount()
            })
        }
    }
    // 报警分析
    lookcomp=()=>{
        /*let option = {
            tooltip: {
                backgroundColor: "rgba(11,71,153,0.7)",
            },
            radar: {
                name: {
                    formatter: '{value}',//蛛网轴尖的数据名称
                    textStyle: {//蛛网轴尖的文字样式
                        fontSize: 14, //外圈标签字体大小
                        color: '#fff' //外圈标签字体颜色
                    },
                    lineStyle: {
                        color: '#A22A40'
                    }
                },
                indicator: [ { name: '人', max:this.props.countalar},
                    { name: '点名', max:this.props.countalar},
                    { name: '车', max: this.props.countalar},
                    { name: '火警', max: this.props.countalar},
                    { name: '巡更', max: this.props.countalar},
                ],
                center: ['50%', '50%'],//统计图位置，示例是居中
                radius: '70%',//统计图大小
                startAngle: 90,//统计图起始的角度
                splitNumber: 3,//统计图蛛网的网格分段，示例分为三段
                // shape: 'circle',//蛛网是圆角还是尖角
                splitArea: { // 蛛网在 grid 区域中的分隔区域，默认不显示。
                    show: true,
                    areaStyle: { // 分隔区域的样式设置。
                        color: ['rgba(76, 140, 200, 0.05)', 'rgba(76, 140, 200, 0.1)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                    }
                },
                axisLine: { //蛛网轴线上的颜色，由内向外发散的那条
                    lineStyle: {
                        color: '#25419E'
                    }
                },
                splitLine: {//蛛网环形的线条颜色
                    lineStyle: {
                        color: '#25419E', // 分隔线颜色
                        width: 1, // 分隔线线宽
                    }
                }
            },
            series: [{
                type: 'radar',
                data : [
                    {
                        value : [this.props.person,this.props.rollcall,this.props.cars,this.props.fire,this.props.patrol],
                        name : '报警分析',
                        areaStyle: {color: '#A22A40'}
                    }
                ]
            }]
        };
        this.setState({option})*/
    }
    xianmap=()=>{ //地图
        //echarts.registerMap('china', china);
       /*  var geoCoordMap=this.props.mapJson;
        var goData =this.props.mapValue;*/
        /*var geoCoordMap = {
            '阿房宫': [108.83, 34.26],
            '明秦王陵遗址': [108, 34],
            "西安文物局":[108.93, 34.34]
        };

        var goData = [{
            name: '阿房宫',
            value: 16079
           },{
            name: '明秦王陵遗址',
            value: 6275
        },{
            name: '西安文物局',
            value: 89
        }];*/
        var geoCoordMap = {
            '西安': [108.938076,34.376661],
            '北京': [116.408032,39.903409],
            "成都":[104.066143,30.573095],
            "大连":[121.78891,39.104001],
            "广东":[114.085947,22.547],
            "江西":[115.870178,28.68071],
            "云南":[102.830354,24.871902],
            "拉萨":[91.171961,29.653482],
            "西宁":[101.778112,36.617042]
        };

        var goData = [{
            name: '西安',
            value: 12
        },{
            name: '西安',
            value: 126
        },{
            name: '成都',
            value: 126
        },{
            name: '大连',
            value: 126
        },{
            name: '广东',
            value: 126
        },{
            name: '江西',
            value: 126
        },{
            name: '云南',
            value: 126
        },{
            name: '拉萨',
            value: 126
        },{
            name: '西宁',
            value: 126
        }];
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var convertData = function(name, data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var fromCoord = geoCoordMap[name];
                var toCoord = geoCoordMap[data[i].name];
                if (fromCoord && toCoord) {
                    res.push({
                        //对换即可调整方向
                        coords: [toCoord, fromCoord]
                    });
                }
            }
            return res;
        };
        var color = ['#F4E925', '#FF0000'];
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
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: '#F29E2E',
                        borderColor: '#F29E2E'
                    }
                }
            });
            return tGeoDt;
        }
       /* var series = [];
        [
            ['西安', goData],
        ].forEach(function(item, i) {
            series.push({
                name: 'item[0]',
                type: 'lines',
                zlevel: 2,
                //线特效配置
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
                        color: color[i]
                    }
                },
                data: convertData(item[0], item[1])
            }, {  //终点
                name: 'item[0]',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                effectType:"ripple", //涟漪特效
                itemStyle: {
                    normal: {
                        color:color[i] ,
                        shadowBlur: 2,
                        shadowColor: '#333'
                    }
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 3, //设置缩放
                    period: 2, //设置时间
                },
                zlevel: 2,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true,
                        color: '#f4e925', //hover时字的颜色
                    }
                },
                symbol: 'circle',
                //圆点大小
                symbolSize:7,
                data: item[1].map(function(dataItem) {
                    return {
                        name: dataItem.name,
                        value: geoCoordMap[dataItem.name]
                    };
                })

            }, {//起点
                name: 'item[0]',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                effectType:"ripple", //涟漪特效
                itemStyle: {
                    normal: {
                        color:color[i],
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 3, //设置缩放
                    period: 2, //设置时间
                },
                zlevel: 2,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'left',
                        show: true
                    },
                    emphasis: {
                        show: true,
                        color: '#f4e925', //hover时字的颜色
                    }
                },
                symbolSize:1 ,
                symbol: 'circle',
                data: [{
                    name: item[0],
                    value: geoCoordMap[item[0]]
                }]

            })

        });*/
        let option={
            background:"#091e57",
            /*tooltip:{
                triggerOn: 'click',
                trigger: 'item',
                backgroundColor: "rgba(11,71,153,0.7)",
                alwaysShowContent: true,
              /!*  position (pos) {
                    let position = getPosOrSize('pos', pos)
                    return position
                },
                formatter (params,p,a) {
                    canvasAnimation(params)
                    let size = getPosOrSize('size')
                    let tooltipDom = `<canvas id="tCanvas" width="${size.width}" height="${size.height}">123</canvas>`
                    return tooltipDom
                }*!/
            },*/
            geo: {
                map: 'china',
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
                        borderColor:"#0EC8D5" //分界线的颜色
                    },
                    emphasis:{
                        areaColor:"#091e57" //悬浮时的颜色
                    },
                }
            },
            series:[{
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.1,
                    color: 'blue',
                    symbol: planePath,
                    symbolSize: 8
                },
                lineStyle: {
                    normal: {
                        color: '#A6C84C',
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                //  data: formtGCData(geoCoordMap, data, '贵阳', true)
            }, {

                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.1,
                    color: '#A6C84C', // 移动箭头颜色
                    symbol: planePath,
                    symbolSize: 10
                },
                lineStyle: {
                    normal: {
                        color: "#A6C84C",
                        width: 1.5,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: formtGCData(geoCoordMap, goData, '西安', false)
            }, {

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
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: 'a6c84c',
                        borderColor: 'gold'
                    }
                },

                data: formtVData(geoCoordMap, goData, '西安')
            }]
            /*[{
                    type:"effectScatter",// series图表类型
                    coordinateSystem:"geo",// series坐标系类型
                    //data:this.props.xianmap, // series数据内容
                    data:[{name: "阿房宫", value: [108.83, 34.26]},{name: "明秦王陵遗址", value: [108, 34]}],
                    effectType:"ripple", //涟漪特效
                    itemStyle: {
                        normal: {
                            color: '#f4e925', //圈圈的颜色
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 3, //设置缩放
                        period: 2, //设置时间
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true,
                            color: '#f4e925', //hover时字的颜色
                        }
                    },
                    symbolSize:20 //涟漪大小
                }
            ]*/
        }
        this.setState({option})
    }
    render() {
        return (
            <ReactEcharts
                option={this.state.option}
                style={{height:this.props.winhe+'px',width:"100%"}}
                onEvents={this.onClickByModel}
            />
        )
    }
}

export default Echartpie;