import React from 'react';
import ReactEcharts from 'echarts-for-react';
const rate =0.953;//0.4+0.2*Math.random();
const linear_color = {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0,
        color: '#18CBFF'
    }, {
        offset: 1,
        color: '#ede0ff'
    }]
};
const option = {
    title: {
        textStyle: {
            color: '#000000',
            fontSize: 20,
            fontWeight: 'bold'
        },
        left: 'center',
        bottom: '3%'
    },
    series: [{
        type: 'pie',
        hoverAnimation: false,
        radius: ['70%', '70%'],
        startAngle: 225,
        labelLine: {
            show: false
        },
        data: [{
            value: rate * 270,
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    formatter: (rate*100).toFixed(2) + '%',
                    textStyle: {
                        color: '#000000',
                        fontSize: 15
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: linear_color,
                    borderWidth: 20
                }
            }
        }, {
            value: 270 - rate * 270,
            itemStyle: {
                normal: {
                    borderColor: 'rgba(250,250,250,1)',
                    borderWidth: 5
                }
            }
        }, {
            value: 90,
            itemStyle: {
                normal: {
                    color: "rgba(0,0,0,0)"
                }
            }
        }],
    }]
};

const Raspberrypi = () => (
    <ReactEcharts
        option={option}
        style={{height: '160px', width: '100%'}}
        className={'react_for_echarts'}
    />
);
export default Raspberrypi