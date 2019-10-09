import React, { Component } from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';


class Sysinfo extends Component {
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false
        };
    }
    componentDidMount() {

    }



    render() {

        return (
           <div>
                <Row>
                    <Col  xl={{ span: 5}} xxl={{ span: 6 }}><label>本次系统启动时间</label><span></span></Col>
                </Row>
           </div> 
        )
    }

}

export default Sysinfo;