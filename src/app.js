import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import $ from "jquery"
import _ from "lodash"
import axios from "axios"

import Index from './pages/index'
import configStore from './store'
import { updateToken } from "./store/login"
// import { initWebsocket } from "./pages/common/logic"
const { initWebsocket } = require("./pages/common/logic")

import './styles/reset.scss'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

window.$ = $
window._ = _
window.axios = axios
window.logger = console
window.$dispatch = store.dispatch;
window.alert = (title) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

axios.interceptors.request.use(function (config) {
  let token = store.getState().login.token
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.data.result.errCode) {
        case 401:
          store.dispatch(updateToken(""));
          if (!window.isCordova) {
            window.localStorage.removeItem("tk");
          }
          alert('token已过期')
      }
    }
    return Promise.reject(error.response && error.response.data) // 返回接口返回的错误信息
  })

class App extends Component {
  config = {
    pages: [
      'pages/home/home',
      'pages/user/user',
      'pages/login/login',
      'pages/login/register',
      'pages/login/resetPwd',
      'pages/about/about',
      'pages/about/licence',
      'pages/about/privacy',
      'pages/about/serviceList',
      'pages/about/userAgreement',
      'pages/systemSetup/systemSetup',
      'pages/feedback/feedback',
      'pages/history/history',
      'pages/nickname/nickname',
      'pages/systemSetup/resetPasswordSys',
      'pages/webview/webview'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '觅星峰',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/home/home",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "签到"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "个人"
      }]
    }
  }

  componentDidMount () {
    initWebsocket()
    let url = window.location.href;
    if(url.split("/#/")[1]){
        window.location.href = url.split("/#/")[0]
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
