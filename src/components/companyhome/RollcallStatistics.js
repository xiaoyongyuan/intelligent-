import React,{Component} from "react";
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
class RollcallStatistics extends Component{
    render() {
        var option = {
            title: {
                textStyle: {
                    color: '#00FFFF',
                    fontSize: 24
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },

            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function (params) {
                  var unOk=params[1].data-params[0].data;
                  var rollcal=`<div>
                                    <p>${params[0].name}</p>
                                     <p>${params[1].marker}${params[1].seriesName}:${params[1].data}</p>
                                     <p><span style="display:inline-block;width:10px;height: 10px;border-radius: 50%;background:linear-gradient(#3023AE,#C96DD8);margin-right: 5px"></span>${params[0].seriesName}:${params[0].data}</p>
                                    <p>${params[1].marker}未完成次数:${unOk}</p>
                               </div>`;
                  return rollcal;
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff',
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#aaa',
                    }
                },
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff',
                    }
                },
                data: this.props.rollcallX,
            }, {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                data: this.props.rollcallX
            },

            ],
            series: [{
                name: '总次数',
                type: 'bar',
                xAxisIndex: 1,
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#277ace',
                        barBorderRadius: 50,
                        borderWidth: 0,
                        borderColor: '#333',
                    }
                },
                data: this.props.rollcallCount
            }, {
                name: '完成次数',
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#3023AE'
                        }, {
                            offset: 1,
                            color: '#C96DD8'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,
                        borderColor: '#333',
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                barGap: '100%',
                data: this.props.rollcallNormal
            }

            ]
        }
        return (
            <ReactEcharts
                option={option}
                className="react_for_echarts"
                style={{width:"100%",height:this.props.echartsHeight}}
            />
        );
    }
}
export default RollcallStatistics;
