import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import xianmap from "../../style/ztt/map/xianmap";
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
            type:this.props.type,
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
    xianmap=()=>{ //地图
        echarts.registerMap('xian', xianmap);
        const option={
            background:"#404a59",
            geo: {
                map: 'xian',
                roam: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: '#80D6EB' },{ offset: 1, color: '#3B80B4' }]
                        )}
                },
                itemStyle:{
                    normal:{
                        areaColor:"#3C82B5",
                        borderColor:"#78CDE5"
                    },
                    emphasis:{
                        areaColor:"#3A80B4"
                    }
                },
                label: {
                    emphasis: {
                        show: false
                    }
                },
            },
            series:[
                {
                    type:"effectScatter",// series图表类型
                    coordinateSystem:"geo",// series坐标系类型
                    data:this.props.xianmap, // series数据内容
                    effectType:"ripple",
                    itemStyle: {
                        normal: {
                            color: '#D5656E',
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
                            color: '#D5656E',
                        }
                    },
                    symbolSize:20
                }
            ]
        }
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
            calculable: true,
            series: [
                {
                    name: '阿房宫',
                    type: 'pie',
                    radius: [55, 75],
                    center: ['50%', '50%'],
                    data: [{
                            value: 15,
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
                                formatter: '阿房宫\n{a|15}个',
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
                            value: 15,
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
                    radius: [60, 70],
                    center: ['50%', '50%'],
                    data: [{
                            value: 3,
                            name: '明秦王陵',
                            itemStyle: {
                                color: "transparent"
                            }
                        },
                        {
                            value: 3,
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
                                formatter: '明秦王陵\n{a|3}个',
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
    //报警分析
    alarmanalyze =()=>{
        let option = {
            tooltip: {
                formatter:function (params,percent) {
                    if(percent==="item_确认_1"){
                        return "确认:1";
                    }else if(percent==="item_虚报警数_1"){
                        return "虚报警数:1";
                    }
                    if(params.name!==""){
                        return params.name+":"+params.value;
                    }
                }
            },
            color: ['rgba(76, 132, 210, .4)'], 
            series: [{
                name: '未处理',
                type: 'pie',
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
                hoverAnimation: true,
                data: [{
                    value: 13618,
                    name: '未处理',
                    label: {
                        normal: {
                            formatter: (13618/16521*100).toFixed(2)+"%",
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
                    value: 2903,
                    label: {
                        normal: {
                            formatter: '\n未处理',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            },{
                name: '虚报',
                type: 'pie',
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
                hoverAnimation: true,
                data: [{
                    value: 1,
                    name: '虚报',
                    label: {
                        normal: {
                            formatter: (1/(16521-1)*100).toFixed(2)+"%",
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
                    value: (16521-1),
                    label: {
                        normal: {
                            formatter: '\n虚报',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                }]
            },{
                name: '忽略',
                type: 'pie',
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
                hoverAnimation: true,
                data: [{
                    value: 2901,
                    name: '忽略',
                    label: {
                        normal: {
                            formatter: (2901/16521*100).toFixed(2)+"%",
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
                    value: (16521-2901),
                    label: {
                        normal: {
                            formatter: '\n忽略',
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
                hoverAnimation: true,
                data: [{
                    value: 1,
                    name: '确认',
                    label: {
                        normal: {
                            formatter: (1/16520*100).toFixed(2)+"%",
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
                    value: 16520,
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
    xianmap=()=>{ //地图
        echarts.registerMap('xian', xianmap);
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
            ]
        }
        this.setState({option})
    }
    render() {
        return (
            <ReactEcharts
                option={this.state.option}
                style={{height:this.props.winhe+'px'}}
                onEvents={this.onClickByModel}
            />
        )
    }
}

export default Echartpie;