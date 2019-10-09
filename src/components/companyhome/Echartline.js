import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
require('echarts/map/js/china.js');
class Echartline extends Component {
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
            tooltip: {
                trigger: 'axis'
            },
            color:['#165ecc','#13fcff'],
            legend: { //图标设置

                x: '50%',
                top: '-1%',
                data:[{
                    name: this.props.apgname,
                    icon: 'circle',
                    textStyle: {
                        color: '#165ecc',
                    }
                },{
                    name: this.props.qwlname,
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
                bottom: '37%',
                top: '11%',
                containLabel: false
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:this.props.timehour,
                name:'时',
                nameTextStyle:{
                    color:'#788cae'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#7d91b4', //更改坐标轴文字颜色
                        fontSize : 14 //更改坐标轴文字大小
                    }
                },
            },
            yAxis: {
                type: 'value',
                name:'次',
                nameTextStyle:{
                    color:'#788cae'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#7d91b4', //更改坐标轴文字颜色
                        fontSize : 14 //更改坐标轴文字大小
                    }
                },
            },
            series: [
                {
                    name:this.props.apgname,
                    type:'line',
                    stack: '阿房宫总量',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#165ecc'
                            },
                            label : {
                                //点上是否显示数值
                                show: false
                            }
                        }
                    },
                    data:this.props.alarmnumapg
                },
                {
                    name:this.props.qwlname,
                    type:'line',
                    stack: '明秦王总量',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#13fcff'
                            },
                            label : {
                                ////点上是否显示数值
                                show: false
                            }
                        }
                    },
                    data:this.props.alarmnumqwl
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
                bottom: '13%',
                top: '20%',
                containLabel: false
            },
            legend: {
                x: '65%',
                top: '0%',
                data:[{
                    name: this.props.rollcallNameqwl,
                    icon: 'circle',
                    textStyle: {
                        color: '#13fcff',
                    }
                }
                ],
            },
            calculable: true,
            xAxis: [{
                show: true,
                type: 'category',
                boundaryGap: true,
                data: this.props.dmdayly,
                name:'日',
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
                name: '次',
                axisLine: {
                    onZero: false,
                    show: false,
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
                    //Y轴刻度值线
                    show: false,
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
                name: this.props.rollcallNameqwl,
                type: 'bar',
                barWidth: '10px',
                symbol: 'symbol',
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
                data: this.props.rollcallNumqwl
            }]
        };
        this.setState({option})

    }
    //巡更次数
    patrol=()=>{
        var color = "#189cbb";var scale = 1;
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: { //图的位置
                left: "3%",
                right: "10%",
                top:'26%',
                bottom: "0%",
                containLabel: true
            },
            legend: { //图标
                x: '50%',
                top: '0',
                data: [this.props.patroNameqwl, this.props.patroNameepg],
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
                    fontSize: 14*scale,
                    padding: [0, 0, 10, 0]
                }
            }],
            xAxis: [{
                type: "category",
                data: this.props.dayly,
                axisLabel: {
                    padding: [0, 15, 0, 0],
                    textStyle: {
                        color: '#fff', //x轴字体
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
                        color: '#fff', //x轴线颜色
                    }
                },
                splitLine: {
                    show:false,
                    lineStyle: {
                        show:false,

                    }
                },
                name: '日',
                nameTextStyle: {
                    color: "#fff",
                    fontSize: 14*scale,
                    padding: [0, 0, 10, 0]
                }
            }],
            series: [{
                name: this.props.patroNameqwl,
                type: "bar",
                data: this.props.patrolNumqwl,
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
                name: this.props.patroNameepg,
                type: "bar",
                data: this.props.patrolNumepg,
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

export default Echartline;