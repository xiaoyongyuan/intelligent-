import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import xianmap from "../../style/ztt/map/xianmap";
require('echarts/map/js/china.js');
class Echartdata extends Component {
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
            type:this.props.type,

        })
    }

    componentDidMount(){
        this[this.state.type]()
        
    }
    xianmap=()=>{ //地图
        echarts.registerMap('xian', xianmap);
        let datasMap=this.state.father.datasMap;
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
                        areaColor:"#091e57", //地图的背景
                        borderColor:"#0bf9f9" //分界线的颜色
                    },
                    emphasis:{
                        areaColor:"#091e57" //悬浮时的颜色
                    },
                }
            },
            series:[
                {
                    name: 'light',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: [{name:'33333',value:[109.06,34.32]}],
                    symbolSize: 18, //圈圈大小
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false  //字体显示
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#F4E925'
                        }
                    }
                },
                {
                    type:"effectScatter",// series图表类型
                    coordinateSystem:"geo",// series坐标系类型
                    data:datasMap, // series数据内容
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
            ]
        }
        this.setState({option})
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
    onByModelClick = (e)=>{
        if(e.componentType === "series"){
            window.location.href="#/app/companyhome/companyscene?code="+this.props.codeID
        }
    }

    onClickByModel={
        'click':this.onByModelClick
    }
    // 报警次数
    alarmnum=()=>{
        let option = {
            // tooltip: {
            //     trigger: 'axis'
            // },
            legend: { //图标设置
                x: '60%',
                top: '0%',
                data:[{
                    name: '阿房宫',
                    icon: 'circle',
                    textStyle: {
                        color: '#165ecc',
                    }
                },{
                    name: '明秦王陵',
                    icon: 'circle',
                    textStyle: {
                        color: '#13fcff'
                    }
                }
                ],
            },
            grid: { //图像的位置
                left: '10%',
                right: '8%',
                bottom: '30%',
                top: '10%',
                containLabel: false
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2','4','6','8','10','12','14','16','18','20','22','24'],
                name:'小时',
                nameTextStyle:{
                    color:'#788cae'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#7d91b4',  //更改坐标轴文字颜色
                        fontSize : 14      //更改坐标轴文字大小
                    }
                },
            },
            yAxis: {
                type: 'value',
                name:'次数',
                nameTextStyle:{
                    color:'#788cae'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#7d91b4',  //更改坐标轴文字颜色
                        fontSize : 14      //更改坐标轴文字大小
                    }
                },
            },
            series: [
                {
                    name:'阿房宫',
                    type:'line',
                    stack: '总量',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#165ecc'
                            }
                        }
                    },
                    data:[120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90]
                },
                {
                    name:'明秦王陵',
                    type:'line',
                    stack: '总量',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#13fcff'
                            }
                        }
                    },
                    data:[220, 182, 191, 234, 290, 330, 310,220, 182, 191, 330, 310]
                }
            ]
        }
        this.setState({option})
    }
    // 点名次数
    rollcall=()=>{
        var option = {
            tooltip: {
                trigger: 'axis'
            },

            textStyle: {
                color: '#32cbd7',
                fontSize: '10px'
            },
            grid: { //图像的位置
                left: '10%',
                right: '8%',
                bottom: '10%',
                top: '15%',
                containLabel: false
            },
            legend: {
                x: '60%',
                top: '0%',
                data:[{
                    name: '阿房宫',
                    icon: 'circle',
                    textStyle: {
                        color: '#165ecc',
                    }
                },{
                    name: '明秦王陵',
                    icon: 'circle',
                    textStyle: {
                        color: '#13fcff'
                    }
                }
                ],
            },
            calculable: true,
            xAxis: [{
                show: true,
                type: 'category',
                boundaryGap: true,
                data: [1,2,3,4,5,6,7],
                name:'天',
                //刻度线是否显示
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    show: true
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        // 使用深浅的间隔色
                       color: '#7d91b4'
                    }
                }
            }],
            yAxis: [{
                    type: 'value',
                    name: '厂用电率',
                    axisLine: {
                        onZero: false,
                        show: true,
                        symbol: ['none', 'arrow'],
                        symbolSize: [10, 10],
                        symbolOffset: [0, 10],
                        lineStyle: {
                            color: '#7d91b4'
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(20,203,215,0.2)'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '',
                    axisLine: {
                        show: false,
                        symbol: ['none', 'arrow'],
                        symbolSize: [10, 10],
                        symbolOffset: [0, 10],
                        lineStyle: {
                            color: 'rgb(20,203,215,0.2)'
                        },
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {}
                }
            ],
            series: [{
                name: '阿房宫',
                type: 'line',
                symbol: 'symbol',
                itemStyle: {
                    normal: {
                        color: '#2cdece',
                        lineStyle: {
                            color: '#13fcff'
                        }
                    }
                },
                data: [
                    1,
                    3,
                    5,
                    6,
                    3,
                    13,
                    11
                ]
            },{
                name: '明秦王陵',
                type: 'bar',
                barWidth: '10px',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: [30, 30, 0, 0],
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [{
                                    offset: 0,
                                    color: '#0394ef'
                                },
                                {
                                    offset: 0.5,
                                    color: '#047ee4'
                                },
                                {
                                    offset: 1,
                                    color: '#066ada'
                                }
                            ]
                        )
                    }
                },
                data: [10, 52, 200, 334, 390, 330, 220]
            }]
        };
        this.setState({option})

    }
    // 可查看单位
    lookcomp=()=>{
        let option = {
            title: {
                text: "2个",
                subtext: '可查看单位',
                x: 'center',
                y: 'center',
                textStyle: {
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 'normal'
                },
                subtextStyle: {
                    color: "rgba(255,255,255,.45)",
                    fontSize: 14,
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    name: '阿房宫',
                    type: 'pie',
                    radius: [60, 90],
                    center: ['50%', '50%'],
                    data: [{
                            value: 34,
                            name: '阿房宫',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    color: '#f6e3a1'
                                }, {
                                    offset: 1,
                                    color: '#ff4236'
                                }])
                            },
                            label: {
                                color: "rgba(255,255,255,.45)",
                                fontSize: 14,
                                formatter: '阿房宫\n{a|34}个',
                                rich: {
                                    a: {
                                        color: "#fff",
                                        fontSize: 20,
                                        lineHeight: 30,
                                    },
                                }
                            }
                        },
                        {
                            value: 52,
                            name: 'rose2',
                            itemStyle: {
                                color: "transparent"
                            }
                        }
                    ]
                },
                {
                    name: '明秦王陵',
                    type: 'pie',
                    radius: [70, 80],
                    center: ['50%', '50%'],
                    data: [{
                            value: 34,
                            name: '明秦王陵',
                            itemStyle: {
                                color: "transparent"
                            }
                        },
                        {
                            value: 52,
                            name: '明秦王陵',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    color: '#348fe6'
                                }, {
                                    offset: 1,
                                    color: '#625bef'
                                }])
                            },
                            label: {
                                color: "rgba(255,255,255,.45)",
                                fontSize: 14,
                                formatter: '明秦王陵\n{a|52}个',
                                rich: {
                                    a: {
                                        color: "#fff",
                                        fontSize: 20,
                                        lineHeight: 30
                                    },
                                }
                            }
                        }
                    ]
                }
            ]
        };
        this.setState({option})
    }
    //巡更次数
    patrol=()=>{
        var color = "#189cbb";var scale = 1;
        let data=[{name:'2017-12-09',value:4},{name:'2017-12-10',value:6},{name:'2017-12-11',value:2},{name:'2017-12-12',value:5},{name:'2017-12-13',value:3},{name:'2017-12-14',value:2},{name:'2017-12-15',value:2}]
        let option = {
                    grid: { //图的位置
                        left: "3%",
                        right: "7%",
                        top:'8%',
                        bottom: "0%",
                        containLabel: true
                    },
                    legend: { //图标
                        data: ['明秦王陵', '阿房宫'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    yAxis: [{
                        type: "value",
                        max: 10,
                        axisLabel: {
                            textStyle: {
                                color: '#fff',
                                fontSize: 14*scale,
                            }
                        },
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: color,
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#fff', //y轴线颜色
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                
                                
                            }
                        },
                        name: '次',
                        nameTextStyle: {
                            color: "#fff",
                            fontSize: 16*scale,
                            padding: [0, 0, 10, 0]
                        }
                    }],
                    xAxis: [{
                        type: "category",
                        data: [1,2,3,4,5,6,7],
                        axisLabel: {
                            padding: [0, 15, 0, 0],
                            textStyle: {
                                color: '#fff', //x轴字体
                                fontSize: 16*scale,
                            }
                        },
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: color,
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#fff', //x轴线颜色
                            }
                        },
                        splitLine: {
                            show:false,
                            lineStyle: {
                               show:false,
                              
                            }
                        },
                        name: '天',
                        nameTextStyle: {
                            color: "#fff",
                            fontSize: 16*scale,
                            padding: [0, 0, 10, 0]
                        }
                    }],

                    series: [{
                        name: "明秦王陵",
                        type: "bar",
                        data: data,
                        barWidth: '30%',
                        barCategoryGap: "35%",
                        label: {
                            normal: {
                                show: false,
                                position: "top",
                                distance:20,
                                formatter: function(params) {
                                    return params.data.value;
                                },
                                textStyle: {
                                    color: "#ffc72b",
                                    fontSize: 16*scale
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: "#04dad5" // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: "#009cd2" // 100% 处的颜色
                                }], false),
                            }
                        },
                        markLine: {
                            symbol: 'none',
                            data: [{
                                type: 'average',
                                valueIndex: 1,
                                lineStyle: {
                                    normal: {
                                        color: color,
                                        type: 'dashed',
                                        width: 0,
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                    }
                                },
                            }]
                        },
                    },{
                        name: "阿房宫",
                        type: "bar",
                        data: data,
                        barWidth: '30%',
                        barCategoryGap: "35%",
                        label: {
                            normal: {
                                show: false,
                                position: "top",
                                distance:20,
                                formatter: function(params) {
                                    return params.data.value;
                                },
                                textStyle: {
                                    color: "#ffc72b",
                                    fontSize: 16*scale
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: "#0b8fc7" // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: "#0c59d0" // 100% 处的颜色
                                }], false),
                            }
                        },
                        markLine: {
                            symbol: 'none',
                            data: [{
                                type: 'average',
                                valueIndex: 1,
                                lineStyle: {
                                    normal: {
                                        color: color,
                                        type: 'dashed',
                                        width: 0,
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                    }
                                },
                            }]
                        },
                    }]
                };
        this.setState({option})
    }
    //报警分析
    alarmanalyze =()=>{
        let option = {
            color: ['rgba(76, 132, 210, .4)'], 
            series: [{
                name: '未处理报警数',
                type: 'pie',
                clockWise: true,
                radius: ['55%', '65%'],
                center: ['15%', 'center'],
                label: {
                    show: true,
                    normal: {
                        position: 'center',
                        textStyle: {
                            color: '#ffd285',
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false, 
                data: [{
                    value: 90,
                    name: '忽略数',
                    label: {
                        normal: {
                            formatter: '40%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 20

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },

                            labelLine: {
                                show: true
                            }
                        } 
                    }
                }, {
                    value: 10,
                    label: {
                        normal: {
                            formatter: '\n未处理报警数',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            },{
                name: '虚报警数',
                type: 'pie',
                clockWise: true,
                radius: ['55%', '65%'],
                center: ['38%', 'center'],
                label: {
                    show: true,
                    normal: {
                        position: 'center',
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false, 
                data: [{
                    value: 90,
                    name: '虚报警数',
                    label: {
                        normal: {
                            formatter: '10%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 20

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },

                            labelLine: {
                                show: true
                            }
                        } 
                    }
                }, {
                    value: 10,
                    label: {
                        normal: {
                            formatter: '\n虚报警数',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            },{
                name: '忽略数',
                type: 'pie',
                clockWise: true,
                radius: ['55%', '65%'],
                center: ['61%', 'center'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                label: {
                    show: true,
                    normal: {
                        position: 'center',
                        textStyle: {
                            color: '#ffd285',
                        },
                    }
                },
                hoverAnimation: false, 
                data: [{
                    value: 90,
                    name: '忽略数',
                    label: {
                        normal: {
                            formatter: '40%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 20

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },

                            labelLine: {
                                show: true
                            }
                        } 
                    }
                }, {
                    value: 10,
                    label: {
                        normal: {
                            formatter: '\n忽略数',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            },{
                name: '确认',
                type: 'pie',
                clockWise: true,
                radius: ['55%', '65%'],
                center: ['85%', 'center'],
                label: {
                    show: true,
                    normal: {
                        position: 'center',
                        textStyle: {
                            color: '#ffd285',
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false, 
                data: [{
                    value: 90,
                    name: '确认',
                    label: {
                        normal: {
                            formatter: '10%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 20

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },

                            labelLine: {
                                show: true
                            }
                        } 
                    }
                }, {
                    value: 10,
                    label: {
                        normal: {
                            formatter: '\n确认',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            }]
        }
        this.setState({option})

    }
    render() {
        const _this=this;
        return (
            <ReactEcharts
                option={this.state.option}
                style={{height:this.props.winhe+'px'}}
                onEvents={this.onClickByModel}
            />
        )
    }
}

export default Echartdata;