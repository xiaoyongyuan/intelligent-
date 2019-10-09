import React from 'react';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
class Radioss extends React.Component {

    state = {
        value: 2,
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    render(){
        return (
            <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>关闭</Radio>
                <Radio value={2}>开启</Radio>
            </RadioGroup>
        );
    };

}

export default Radioss;