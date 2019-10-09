import React,{ Component } from 'react';
import { Row, Col, Card } from 'antd';
import Relationshipnetwork from './Relationshipnetwork'
import {post} from "../../axios/tools";
import '../../style/ztt/css/Companyhome.css'
class Connent extends Component{
    constructor(props){
        super(props);
        this.state={
            myNetwork:[],
            myLookUser:"",
            lookMyuser:"",
            come:[],
            out:[]
        };
    }
    componentDidMount() {
        post({url:"/api/company/getone"},(res)=>{
            if(res.success){
                this.setState({
                    main:res.data.cname,
                    come:res.passivelist,
                    out :res.activelist
                },()=>{
                    console.log('main',this.state.main)
                    console.log('come',this.state.come)
                    console.log('out',this.state.out)
                    
                })
            }
        })
    }

    render() {
        return(
            <div className="gutter-example button-demo">
                <Row>
                    <Col span={6} offset={5} className="topShift">
                        <Card>
                            <div className="pb-m">
                                <Row>
                                    <Col span={12}>
                                        <span className="titleFont">查看我的用户</span>
                                    </Col>
                                    <Col span={12}>
                                        <span className="titleFont">共计：{this.state.come.length}</span>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                            {
                                this.state.come.map((v,i)=>(
                                    <Row key={i}>
                                        <Col span={12}><p>{v.activename}</p></Col>
                                        <Col span={12}><p>设备:{v.avtiveecount}</p></Col>
                                    </Row>
                                ))
                            }
                            </div>

                        </Card>
                    </Col>
                    <Col span={6} className="rightShift topShift">
                        <Card>
                            <div className="pb-m">
                                <Row>
                                    <Col span={12}>
                                        <span className="titleFont">我查看的用户</span>
                                    </Col>
                                    <Col span={12}>
                                        <span className="titleFont">共计：{this.state.out.length}</span>
                                    </Col>
                                </Row>
                            </div>
                            {
                                this.state.out.map((v,i)=>(
                                    <Row key={'out'+i}>
                                        <Col span={12}><p>{v.activename}</p></Col>
                                        <Col span={12}><p>设备:{v.avtiveecount}</p></Col>
                                    </Row>
                                ))
                            }
                        </Card>
                    </Col>
                </Row>
            <Relationshipnetwork main={this.state.main} come={this.state.come} />
            </div>
        );
    }
}
export default Connent