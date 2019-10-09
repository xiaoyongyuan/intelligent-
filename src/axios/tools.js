/**
 * http通用工具函数
 */
import axios from "axios";
import jsonP from "jsonp";
import axiosPro from "axios-jsonp-pro";

import { message } from "antd";

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
const Httpurl = window.g.url;
const qrcodeurl = window.g.loginurl;

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = async (
  { url, msg = "接口异常", data = {}, type },
  callback
) => {
  const token = localStorage.getItem("token");
  const comid = localStorage.getItem("comid");
  const account = localStorage.getItem("account");

  if (
    !account ||
    account === "undefined" ||
    !token ||
    !comid ||
    token === "undefined" ||
    comid === "undefined"
  ) {
    window.location.href = "#/login";
    return callback(false);
  }
  const head = {
    headers: {
      AUTHORIZATION: token
    }
  };

  axios
    .post(
      Httpurl + url,
      Object.assign({ comid: comid, user: account }, data),
      head
    )
    .then(res => {
      if (res.data.success === 1) {
        return callback(res.data);
      } else if (res.data.success === 2) {
        window.location.href = "#/login";
        return callback(false);
      } else {
        if (type) {
          return callback(false);
        }
        message.warn(res.data.errorinfo);
        return callback(false);
      }
    })
    .catch(err => {
      console.log("err", err);
      message.warn(msg);
    });
};

export const qrcode = async (
  { url, msg = "接口异常", data = {} },
  callback
) => {
  axios
    .post(qrcodeurl + url, data)
    .then(res => {
      return callback(res.data);
    })
    .catch(err => {
      message.warn(msg);
    });
};

export const crossjsonP = async({url, msg = '接口异常',data={}},callback) =>{
  return new Promise((resolve,reject)=>{
    console.log('response',url)
    jsonP(url,{param:'successCallback'},function(err,response){
      console.log('response',response)
      if(response){
        resolve(response);
      }else{
        reject(null)
      }
    })
  })
}

//使用别人封装的jsonp
// export const crossjsonP = async (
//   { url, msg = "jsonp接口异常", data = {} },
//   callback
// ) => {
//   axiosPro
//     .jsonp(url)
//     .then(function(res) {
//       console.log('获得数据',res)

//       return callback(res);
//     })
//     .catch(function(error) {
//       console.log('yichang')
//       // console.log(error);
//       message.warn(msg);
//     });
// };
