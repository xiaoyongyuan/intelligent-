import * as type from './type';
// import * as http from '../axios/index';
// import * as http from '../axios/tools';
import axios from 'axios';
import { message } from 'antd';

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});
//login时用到过
export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});

export const changecomptype = (data,category) => ({ //切换公司
    type: type.CHANGE_COMP,
    value:'active',
    data,
    category
});
export const alarmmax = (data,category) => ({ //获取最大报警数
    type: type.ALARM_MAX,
    value:'alarmmax',
    data,
    category
});
export const clearauth = (category) => ({ //获取最大报警数
    type: type.CLEAR_ANTD,
    category
});



export const changeComp=(data)=> dispatch =>{ //切换公司
  dispatch(changecomptype(data,'auth')); //第二个参数写死
}

export const alarmMax=(data)=> dispatch =>{ //切换公司
  dispatch(alarmmax(data,'auth')); //第二个参数写死
}
export const clearAuth=()=> dispatch =>{ //退出
  dispatch(clearauth('auth')); //第二个参数写死
}


/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
// export const fetchData = ({funcName, params, stateName}) => dispatch => { //已更改，后期删除
//     !stateName && (stateName = funcName);
//     dispatch(requestData(stateName));
//     return http[funcName](params).then(res => dispatch(receiveData(res, stateName)));
// };
//lff登录在用
export const fetchData = ({funcName, url, params, stateName}) => dispatch => {
    !stateName && (stateName = funcName); 
    dispatch(requestData(stateName));
    
    axios.post('http://login.aokecloud.cn'+url,params).then(res => {
      if(res.data.success===1){
        dispatch(receiveData(res.data, stateName))
        return res.data
      }else if(res.data.success===2){
        message.warn(res.data.errorinfo);
      }else{
        message.warn(res.data.errorinfo);
      }    	
    }).catch(err => {
      console.log('err',err);
      message.warn('接口异常');
	});
};


