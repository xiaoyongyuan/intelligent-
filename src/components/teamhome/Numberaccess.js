import React from 'react';
import ReactEcharts from 'echarts-for-react';

class Numberaccess extends React.Component{
    render(){
        const option = {
            title : {
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show:true,
                x : 'right',
                y : 'bottom',
                fontSize:'8',
                orient:'vertical',
                data:['树莓派','局域网']
            },
            color:['#F4A425','#FB7575'],
            calculable : true,
            series : [
                {
                    name:'分类入网数',
                    type:'pie',
                    radius: ['12%', '96%'],
                    center : ['25%', '50%'],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {value:this.props.raspberry, name:'树莓派'},
                        {value:this.props.LANequipment, name:'局域网'},
                    ]
                }
            ]
        };
        return(
            <ReactEcharts
            option={option}
            style={{height: '100px', width: '100%'}}
            className={'react_for_echarts'}
        />
        )
    }
}
export default Numberaccess;