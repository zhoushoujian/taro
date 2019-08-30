import Taro, { Component } from '@tarojs/taro'

// 微信登录
export const onLoginByWeapp = (e) => {
  e.stopPropagation();



  Taro.login({
    success: function(res) {
      console.log(res);
      if (res.code) {
        //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息

        wx.getSetting({
          success(res) {
            console.log('111', res)
            if (!res.authSetting['scope.userInfo']) {
              console.log('2222')
              wx.authorize({
                scope: 'scope.userInfo',
                success () {
                  console.log('success')
                  var that = this
                  wx.getUserInfo({
                    success: function (res) {
                      console.log('getUserInfo res',res);
                      wx.request({
                        url: app.server.hostUrl + '/api/auth/login_by_weixin.do',//自己的服务接口地址,这里是去拿到code去后台进行业务处理，调用微信接口拿到用户openid和凭证，在解密拿到用户数据
                        method: 'post',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                        success: function (data) {
                          wx.setStorage({
                            key: "userif",
                            data: data.data.userinfo
                          })
                          console.info('success', data);
                          //4.解密成功后 获取自己服务器返回的结果
                          if (data.data.code == 1) {
                            var userInfo_ = data.data.userinfo;
                            console.log(7);
                            app.globalData.userInfo = userInfo_
                            // that.setData({
                            //   getUserInfoFail: false,
                            //   userInf: userInfo_,
                            //   hasUserInfo: true

                            // })
                            thist.setData({
                              datas: userInfo_,
                              index: 1
                            })
                            console.log(userInfo_)
                            that.onLoad();
                          } else {
                            console.log('解密失败')
                          }

                        },
                        fail: function () {
                          console.log('系统错误')
                        }
                      })

                      //平台登录
                    },
                    fail: function (res) {
                      console.log(8);
                      console.log(res);
                      // that.setData({
                      //   getUserInfoFail: true
                      // })
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        console.log("登录失败！" + res.errMsg);
      }
    }
  });
};

// 支付宝登录
export const onLoginByAlipay = (e) => {
  e.stopPropagation();
  my.getAuthCode({
    scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
    success: (res) => {
      console.log(res)
      if(res.authCode) {
        // 调用后台授权登录
      }
    },
    fail:function(res) {
      console.log("登录失败！" + res);
    }
  })
};
