import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import "../../style/yal/css/overView.css";
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
    // 巡更次数
    alarmnum=()=>{
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(11,71,153,0.7)",
                axisPointer: {
                    type: "shadow",
                    textStyle: {
                        color: "#fff"
                    }
                },
                borderColor:{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#DB8A20'
                    }, {
                        offset: 1,
                        color: '#CF3D29'
                    }])
                }
            },
            legend: {
                icon:"circle",
                data: this.props.patrolName,
                textStyle: {
                    color:["#DB8A20","#4BAFD3"],
                },
                align: 'left',
                right: 10,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 35
            },
            grid: {
                left: '10%',
                right: '8%',
                bottom: '33%',
                containLabel: false
            },
            xAxis: [{
                type: 'category',
                name:"天",
                nameTextStyle:{
                    color:"#fff"
                },
                data:this.props.patrolX,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#586680",
                        width: 1,
                        type: "solid"
                    }
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#fff",
                    }
                },
            }],
            yAxis: [{
                name:"次数",
                nameTextStyle:{
                    color:"#fff"
                },
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: "#fff",
                    }
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#586680",
                        width: 1,
                        type: "solid"
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: "#061C3C",
                    }
                },
            }],
            series: [{
                name: '阿房宫',
                type: 'bar',
                data: this.props.patrolafangafang,
                itemStyle: {
                    normal: {
                        barBorderRadius: 50,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#DB8A20'
                        }, {
                            offset: 1,
                            color: '#CF3D29'
                        }]),
                        opacity: 1,
                    }
                }
            },{
                name: '明秦王陵遗址',
                type: 'bar',
                data: this.props.patrolafangming,
                itemStyle: {
                    normal: {
                        barBorderRadius: 50,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#4BAFD3'
                        }, {
                            offset: 1,
                            color: '#1664C2'
                        }]),
                        opacity: 1,
                    }
                }
            }]
        };
        this.setState({option})
    }
    //报警次数
    rollcall=()=>{
        var option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(11,71,153,0.7)",
                axisPointer: {
                    lineStyle: {
                        color:"rgba(11,71,153,0.7)"
                    }
                }
            },
            legend: {
                icon:"circle",
                data: this.props.alarmName,
                align: 'left',
                right: 10,
                textStyle: {
                    color:["#0D77A4","#CE3929"]
                },
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 35
            },
            grid: {
                left: '10%',
                right: '11%',
                bottom: '15%',
                containLabel: false
            },
            xAxis: [{
                name:"小时",
                nameTextStyle:{
                    color:"#fff"
                },
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#657D9D'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color:"#ffffff"
                    }
                },
                data:this.props.alarmX
            }],
            yAxis: [{
                name:"次数",
                nameTextStyle:{
                    color:"#fff"
                },
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#5B6B89'
                    },
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        color:"#ffffff"
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#07234B'
                    }
                },
            }],
            series: [{
                name: '阿房宫',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(16,97,204, 0.5)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(17,235,210, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(16,97,204,0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(17,235,210,1)'
                        }])
                    },
                    emphasis: {
                        color: 'rgb(0,196,132)',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10
                    }
                },
                data: this.props.alarmafang
            }, {
                name: '明秦王陵遗址',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(205,52,42, 0.5)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(235,235,21, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    },
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(235,234,21,0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(205,52,42,1)'
                        }])
                    },
                    emphasis: {
                        color: 'rgb(99,250,235)',
                        borderColor: 'rgba(99,250,235,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10
                    }
                },
                data: this.props.alarmming
            }]
        };
        this.setState({option})

    }
    //点名次数
    patrol=()=>{
        let option = {
            grid: {
                left: '13%',
                right: '8%',
                bottom: '13%',
                top: '20%',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(11,71,153,0.7)",
                axisPointer: {
                    type: "shadow",
                    textStyle: {
                        color: "#fff"
                    }
                }
            },
            legend: {
                data: this.props.rollName,
                icon:"circle",
                align: 'left',
                right: 10,
                textStyle: {
                    color:["#BD3827","#2971CD","#BD3827"]
                },
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 35
            },
            xAxis: [{
                type: 'category',
                name:"天",
                nameTextStyle:{
                    color:"#fff"
                },
                boundaryGap: true,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: '#5B6B89'
                    },
                },
                axisLabel: { //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: '#d1e6eb',
                    },
                },
                axisTick: {
                    show: false,
                },
                data: this.props.rollArrX,
            }],
            yAxis: [{
                type: 'value',
                name:"次数",
                nameTextStyle:{
                    color:"#fff"
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#07234B'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#5B6B89'
                    },
                },
                axisLabel: {
                    margin: 20,
                    textStyle: {
                        color: '#d1e6eb',

                    },
                },
                axisTick: {
                    show: false,
                },
            }],
            series: [{
                name: '阿房宫',
                type: 'line',
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 6,
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(205,52,42,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(235,234,21,1)'
                        }])
                    },
                    borderColor: '#f0f'
                },
                itemStyle: {
                    normal: {
                        color: "#D53A25",
                    }
                },
                tooltip: {
                    show: true
                },
                data: this.props.afang
            }, {
                name: '明秦王陵遗址',
                type: 'bar',
                barWidth: 20,
                tooltip: {
                    show: true
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [{
                                offset: 0,
                                color: '#14c8d4'
                            },
                                {
                                    offset: 1,
                                    color: '#2971CD'
                                }
                            ]
                        )
                    }
                },
                data:this.props.ming
            },{
                name: '西安文物局',
                type: 'bar',
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 6,
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(205,52,42,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(235,234,21,1)'
                        }])
                    },
                    borderColor: '#f0f'
                },
                itemStyle: {
                    normal: {
                        color: "#D53A25",
                    }
                },
                tooltip: {
                    show: true
                },
                data: this.props.bowen
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