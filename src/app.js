import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'
import configStore from './store'
// import { initWebsocket } from "./utils/utils"
const { initWebsocket } = require("./utils/utils")
import { set as setGlobalData } from "./global_data"

import './styles/reset.scss'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

setGlobalData('config', {
  domain: "http://94.191.67.225",
  // domain: "http://localhost",
  // domain: "http://192.168.199.162",
  host: "94.191.67.225",
  // host: "localhost",
  // host: "192.168.199.162",
  port: "8000",
  socketPort: "8001",
  version: "1.0.0"
})
setGlobalData("$dispatch", store.dispatch)
setGlobalData("$getState", store.getState)
setGlobalData("alert", (title) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
})


class App extends Component {
  config = {
    pages: [
      'pages/home/home',
      'pages/user/user',
      'pages/login/login',
      'pages/systemSetup/systemSetup',
      'pages/feedback/feedback',
      'pages/history/history',
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
    console.log('current environment: ',process.env.TARO_ENV)
    if(process.env.TARO_ENV === 'h5'){
      const url = window.location.href;
      if(url.split("/#/")[1]){
          window.location.href = url.split("/#/")[0]
      }
      initWebsocket()
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
