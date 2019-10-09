import React,{Component} from 'react';

import ReactEcharts from 'echarts-for-react';
const mainColor='#ffb402';
const comeColor='#ec407a';
const outColor='#35c2ff';

class Relationshipnetwork extends Component{
    constructor(props){
        super(props);
        this.state={
            option:{},
            nextProps:{
                come:[], //查看我的
                out:[], //我可查看的
            }
        };
    }
    componentDidMount(){
        if(!this.state.nextProps.main) return;
        let links=[],data=[];
        data.push({
            name: this.state.nextProps.main,
            symbolSize: 80,
            itemStyle:{
                normal:{
                    color:mainColor,
                }
            }
        })
        if(this.state.nextProps.come.length){
            this.state.nextProps.come.map((el)=>{
                links.push({
                    target:this.state.nextProps.main,
                    source:el.activename,
                    label:{
                        show:false
                    }
                });
                data.push({
                    name: el.activename,
                    symbolSize: 60,
                    itemStyle:{
                        normal:{
                            color:comeColor
                        }
                    }
                })
                return '';
            })
        }
        if(this.state.nextProps.out.length){
            this.state.nextProps.out.map((el,i)=>{
                links.push({
                    target: el.activename,
                    source:this.state.nextProps.main,
                    label:{
                        show:false
                    }
                })
                data.push({
                    name: el.activename,
                    symbolSize: 60,
                    itemStyle:{
                        normal:{
                            color:outColor
                        }
                    }
                })
                return '';
            })
        }

        let option={
                tooltip: {
                    formatter: function(x) {
                        return x.data.des;
                    }
                },
                series: [
                {
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 58,
                    roam: true,
                    edgeSymbol: ['circle', 'arrow'],
                    // edgeSymbolSize: [80, 10],
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    force: {
                        /*调整线条的长短*/
                        repulsion: 3500,
                        edgeLength: [10, 50]
                    },
                    draggable: true,
                    itemStyle: {
                        normal: {
                            color: '#4b565b'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2,
                            color: '#4b565b'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {}
                        }
                    },
                    data:data,
                    links:links
                }]
            };

            this.setState({option})
    }
    componentWillReceiveProps(nextProps){
        if(nextProps!==this.state.nextProps){
            this.setState({
                nextProps:nextProps
            },()=>{            
                this.componentDidMount()
            })
        }
    }
    render(){ 
        return(
            <ReactEcharts
                option={this.state.option}
                style={{height: '490px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}
export default Relationshipnetwork