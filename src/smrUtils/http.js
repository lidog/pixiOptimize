import Vue from 'vue'
import axios from 'axios' //ajax请求库
import Util from "@/utils/tools";
import {
  Message
} from 'element-ui'
axios.defaults.timeout = 60000 //60秒的超时验证

const LoadingComponent = Vue.extend({
  template: '<div id="Overlay" class="m-loading"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>'
})
const loading = new LoadingComponent().$mount()
//以Promist形式封装http请求
const requestUrlList = []
// 处理拦截器和Loading相关
const handlerAfterRequest = function (url) {
  if (requestUrlList.indexOf(url) !== -1) {
    requestUrlList.splice(requestUrlList.indexOf(url), 1)
  }
  if (document.getElementById('Overlay')) {
    document.getElementById('app').removeChild(loading.$el)
  }
  clearTimeout(showGlobalTimer);
  showGlobalTimer = null;
}
let showGlobalTimer;
const showGlobalLoading = function () {
  document.getElementById('app').appendChild(loading.$el)
}
export function httpRequest(url, params, method, contentType, noLoading) {
  return new Promise((resolve) => {
    url = '/API' + url;
    if (requestUrlList.indexOf(url) !== -1) {
      return;
    }
    let urlParams = '';
    if (contentType === 'form' || method === 'get') {
      let urlParamsList = []
      for (let index in params) {
        urlParamsList.push(`${index}=${params[index]}`)
      }
      urlParams = urlParamsList.join('&');
      if (urlParams) {
        url = `${url}${url.indexOf('?')>-1?'&':'?'}${urlParams}`
      }
    }
    requestUrlList.push(url);
    if (!noLoading) {
      // document.getElementById('app').appendChild(loading.$el)
      if (showGlobalTimer) {
        clearTimeout(showGlobalTimer);
      }
      showGlobalTimer = setTimeout(() => {
        showGlobalLoading()
      }, 200);
    }
    let headers = {
      'Content-Type': contentType === 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
    }
    axios[method || 'post'](url, contentType === 'form' || method === 'get' ? {} : params, {
      headers: headers
    }).then(response => {
      resolve(response.data);
      handlerAfterRequest(url);
    }).catch((error) => {
      handlerAfterRequest(url);
      if (error.request) {
        if (error.request.status > 200) {
          Message.error({
            dangerouslyUseHTMLString: true,
            message: `<p>${error.request.status}，${error.request.statusText}</p>
        <p>${error.request.responseText}</p>`,
            duration: 1500,
            onClose: function () {
              if (error.request.status === 401) {
                Util.clearLocalData();
                window.location.reload();
              }
            }
          })
        } else {
          Message.error({
            dangerouslyUseHTMLString: true,
            message: `<p>${error.request.status}，网络连接超时</p>`
          })
        }
      }
      // reject(error);
    })
  })
}