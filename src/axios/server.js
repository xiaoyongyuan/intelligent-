/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import axios from 'axios';
import { message } from 'antd';

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
const login='http://login.aokecloud.cn';


export const httppost = ({url,msg = '接口异常',params}) => {
  //取出身份 token选择发送的地址,取出token
  let head={
      headers:{
        'Authorization':"11111111111"
      }
  }
  axios.post(url,json.stringify(params),head).then(res => {
    switch(res.data.success){
      case 0;
        message.warn(res.data.errorinfo);
        break;
      case 1:
        return res.data.data;
      case 2: //token过期
        break;
    }    
  }).catch(err => {
    message.warn(msg);
  });
}



export const webpost = ({url, msg = '接口异常',data, headers}) =>{
		console.log('webposturl',url)
		console.log('webpostdata',data)
		console.log('webpostheaders',headers)

	 //  axios.post(Httpurl+url, headers).then(res => res.data).catch(err => {
  //     console.log('err',err);
  //     message.warn(msg);
		// });
}

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({url, data, msg = '接口异常', headers}) =>
    axios.post(url, data, headers).then(res => res.data).catch(err => {
        console.log(err);
        message.warn(msg);
    });
