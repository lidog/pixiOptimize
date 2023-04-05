import axios from "axios";
// MessageBox,
import { Notification, Message, Loading } from "element-ui";
import errorCode from "@/utils/errorCode";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
let loadingInstance;

// 创建axios实例
const service = axios.create({
 //webapi url  
  baseURL: 'http://188.2.76.92:8010/',
  // baseURL: 'http://188.1.34.177:8808/',
  // baseURL: 'http://188.1.34.177:8000/',
  // 超时
  timeout: 60000
  //timeout: 0
});
// request拦截器
service.interceptors.request.use(
  config => {
    
    if (document.querySelector(".el-dialog-loading")) {
      if (document.querySelector(".el-dialog-loading").style.display != "none" && loadingInstance == null) {
        loadingInstance = Loading.service({
          target: document.querySelector(".el-dialog-loading"),
          text: "正在处理中，请稍后...",
          spinner: "el-icon-loading"
        });
      } else {
        if (document.querySelector(".LoadingDiv")) {
          if (loadingInstance == null) {
            loadingInstance = Loading.service({
              target: document.querySelector(".LoadingDiv"),
              text: "Loading",
              spinner: "el-icon-loading"
            });
          }
        }
      }
    } else {
      if (document.querySelector(".LoadingDiv")) {
        if (loadingInstance == null) {
          loadingInstance = Loading.service({
            target: document.querySelector(".LoadingDiv"),
            text: "Loading",
            spinner: "el-icon-loading"
          });
        }
      }
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    if (loadingInstance != null) {
      loadingInstance.close();
      loadingInstance = null;
    }
    // debugger;
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      //
    } else if (code === 500) {
      if (msg.includes("Access token expired")) {
        Message({
          message: "登录已超时，请重新登录！",
          type: "error",
          showClose: true,
          dangerouslyUseHTMLString: true,
          duration: 10000
        });
      }  else {
        //ShowMessage(msg, "error", 1000);
        //debugger;
        Message({
          message: msg,
          type: "error",
          showClose: true,
          dangerouslyUseHTMLString: true,
          duration: 10000
        });
      }
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Notification.error({
        title: msg
      });
      return Promise.reject("error");
    } else {
      // console.log(res.data);
      return res.data;
    }
  },
  error => {
    if (loadingInstance != null) {
      loadingInstance.close();
      loadingInstance = null;
    }
    // debugger;
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: "error",
      showClose: true,
      duration: 10 * 1000
    });
    return Promise.reject(error);
  }
);


export default service;
