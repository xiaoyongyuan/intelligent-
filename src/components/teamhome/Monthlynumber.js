import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
class Monthlynumber extends React.Component{
    render(){
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '8%',
                left: '1%',
                right: '1%',
                bottom: '8%',
                containLabel: true,
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: false,
                    lineStyle: {
                        color: '#233e64'
                    },
                },
                axisLabel: { //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: '#6a9cd5',
                        margin:15,
                    },
                },
                axisTick: { show: false,},
                data: this.props.monthlyX,
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#233e64'
                    }
                },
                axisLine: {show: false,},
                axisLabel: {
                    margin:20,
                    textStyle: {
                        color: '#6a9cd5',
                    },
                },
                axisTick: { show: false,},
            }],
            series: [{
                name: '异常流量',
                type: 'line',
                smooth: true, //是否平滑曲线显示
        // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                symbolSize:0,
                lineStyle: {
                    normal: {
                        color:"#6D9FF9"
                    }
                },
                //区域填充样式
                areaStyle: {
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: 'rgba(212,230,255, 0.9)'},
                            {offset: 0.7, color: 'rgba(243,247,255, 0)'}
                        ], false),

                        shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
                data: this.props.monthlyY
            }]
        };
        return(
            <ReactEcharts
            option={option}
            style={{height: '200px', width: '100%'}}
            className={'react_for_echarts'}
        />
        )
    }
}
export default Monthlynumber
