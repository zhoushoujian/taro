import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import $ from "jquery"
import _ from "lodash"
import axios from "axios"

import Index from './pages/index'

import configStore from './store'

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
// window.goRoute = (url) => {
//   Taro.navigateTo({
//     url
//   })
// }

// axios.interceptors.request.use(function (config) {
//   let token = window.$getState().login.token
//   if (token) {
//         config.headers.Authorization = token;
//   }
//   return config;
// }, function (err) {
//   return Promise.reject(err);
// })
// axios.interceptors.response.use(
// response => {
//   return response
// },
// error => {
//   if (error.response) {
//     switch (error.response.data.result.errCode) {
//       case 401:
//         window.$dispatch(updateToken(""));
//         if(!window.isCordova){
//           window.localStorage.removeItem("tk");
//         }
//         alert('token已过期')
//     }
//   }
//   return Promise.reject(error.response && error.response.data) // 返回接口返回的错误信息
// })

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

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
