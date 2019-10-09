import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import xianmap from "../../style/ztt/map/xianmap";
require('echarts/map/js/china.js');
class Locationmap extends Component {
    constructor(props){
        super(props);
        this.state= {
            father:{},
            option:{}
        }
    }
    componentWillMount(){
        console.log('this.propsthis.props',this.props)
        this.setState({
            father:this.props
        })
    }

    componentDidMount(){
        this.lookcomp()

        return;
        //地图
        echarts.registerMap('xian', xianmap);
        let datasMap=this.state.father.datasMap;
        console.log('datasMapdatasMap',datasMap);
        let option={
            backgroundColor: '#001c3d', //背景颜色
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
    // 点名次数
    rollcall=()=>{
        var option = {
            backgroundColor: '#001c3d',
            tooltip: {
                trigger: 'axis'
            },

            textStyle: {
                color: '#32cbd7',
                fontSize: '10px'
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            calculable: true,
            xAxis: [{
                show: true,
                type: 'category',
                boundaryGap: true,
                data: [1,2,3,4,5,6,7],
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
            backgroundColor: "#001c3d",
            title: {
                text: "12",
                subtext: '',
                x: 'center',
                y: 'center',
                textStyle: {
                    color: "#fff",
                    fontSize: 30,
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
                    radius: [100, 130],
                    center: ['50%', '50%'],
                    data: [{
                            value: 34,
                            name: '吴际帅\n牛亚莉',
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
                                formatter: '完成梳理部门\n{a|34}个',
                                rich: {
                                    a: {
                                        color: "#fff",
                                        fontSize: 20,
                                        lineHeight: 30
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
                    name: '面积模式',
                    type: 'pie',
                    radius: [110, 120],
                    center: ['50%', '50%'],
                    data: [{
                            value: 34,
                            name: '吴际帅\n牛亚莉',
                            itemStyle: {
                                color: "transparent"
                            }
                        },
                        {
                            value: 52,
                            name: 'rose2',
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
                                formatter: '部门总量\n{a|52}个',
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
                    backgroundColor: '#001c3d',
                    grid: { //图的位置
                        left: "3%",
                        right: "2%",
                        bottom: "3%",
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
            backgroundColor:'#042F63',
            title: {
                text: '80%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#fff',
                    fontSize: '30'
                }
            },
            color: ['rgba(76, 132, 210, .4)'], 
            legend: { //图标
                show: false,
                itemGap: 12,
                data: ['01', '02']
            },
           
            series: [{
                name: '未处理报警数',
                type: 'pie',
                clockWise: true,
                radius: ['50%', '66%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false, 
                data: [{
                    value: 90,
                    name: '01',
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
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        } 
                    }
                }, {
                    name: '02',
                    value: 10
                }]
            }]
        }
        this.setState({option})

    }
    render() {
        return (
            <ReactEcharts
                option={this.state.option}
                style={{height: '480px', width: '100%'}}
                className={'react_for_echarts'}
                onEvents={this.onClickByModel}
            />
        )
    }
}

export default Locationmap;