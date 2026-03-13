export default defineAppConfig({
  pages: [
    'pages/home/home',
    'pages/user/user',
    'pages/systemSetup/systemSetup',
    'pages/feedback/feedback',
    'pages/history/history',
    'pages/systemSetup/resetPasswordSys',
    'pages/showOnlinePersons/showOnlinePersons',
    // 'pages/webview/webview'
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
})
