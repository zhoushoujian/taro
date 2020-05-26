import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'
import configStore from './store'
import { set as setGlobalData } from "./global_data"
import "./observer"

import './styles/reset.scss'
import './app.scss'

const store = configStore()

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
      'pages/systemSetup/systemSetup',
      'pages/feedback/feedback',
      'pages/history/history',
      'pages/systemSetup/resetPasswordSys',
      'pages/showOnlinePersons/showOnlinePersons',
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
