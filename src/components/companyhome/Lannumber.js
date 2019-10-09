import React from 'react';
import ReactEcharts from 'echarts-for-react';
var data = [];
for(var i=1 ;i<=60;i++ ){
    if (i<=20) {
        data.push({
            value: 8,
            name: '在线设备'
        })
    }
    if(i>20&&i<=40){
        data.push({
            value: 8,
            name: 'bb'
        })}
    if(i>40&&i<=60){
        data.push({
            value: 8,
            name: 'bbcc'
        })
    }

}
const option = {
    title: {
        text: '50%',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#000000',
            fontSize: 20
        }
    },
    series: [{
        name: '在线设备',
        type: 'pie',
        radius: ['70%', '90%'],
        center: ['50%', '50%'],
        clockwise: false,
        data: data,
        color: [
            '#FF9208',
            '#fff',
            "#CFCFCF",
        ],
        hoverAnimation: false,
        legendHoverLink: false,
        label: {
            normal: {
                show:false,
            },
            emphasis:{
                show:false
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                borderWidth: 4,
                borderColor: '#ffffff',
            },
            emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },

    ],

};

const Lannumber = () => (
    <ReactEcharts
        option={option}
        style={{height: '160px', width: '100%'}}
        className={'react_for_echarts'}
    />
);
export default Lannumber