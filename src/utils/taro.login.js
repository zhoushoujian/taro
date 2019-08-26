import Taro, { Component } from '@tarojs/taro'

// 微信登录
export const onLoginByWeapp = (e) => {
  e.stopPropagation();
  Taro.login({
    success: function(res) {
      console.log(res);
      if (res.code) {
        //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
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
