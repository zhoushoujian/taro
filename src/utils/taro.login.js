import Taro from '@tarojs/taro'
import { fetch } from "./utils"
import { HTTP_URL } from "../constants/api"
import { setStorage, networkErr, initWebsocket } from './utils'
import TaroAlipay from "./taro.alipay"
import { get as getGlobalData } from '../global_data'

// 微信登录
export const onLoginByWeapp = (updateUsername, updateToken) => {
  return new Promise(resolve => {
    Taro.login({
      success: async function(res) {
        if (res.code) {
          const data = {code: res.code, env: "weapp"}
          //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
          await dealWithMiniProgramLogin(data, updateUsername, updateToken)
          resolve()
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  })
};

export const remindWeAppUser = (updateSetNickname, updateSetHeadPic) => {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: function (res) {
            const userInfo = res.userInfo;
            const {
              avatarUrl,
              nickName
            } = userInfo;
            updateSetNickname(nickName);
            updateSetHeadPic(avatarUrl);
          },
          fail(err) {
            // getGlobalData('alert')("请手动点击签到登录");
          }
        })
      } else {
        if(!getGlobalData("$getState")()['user']['setNickname'] && !getGlobalData("$getState")()['user']['setHeadPic']){
          getGlobalData('alert')("请手动点击签到登录");
        }
      }
    },
    fail(err) {
      // getGlobalData('alert')("请手动点击签到登录");
    }
  })
}

// 支付宝登录
export const onLoginByAlipay = async(updateUsername, updateToken) => {
  return new Promise((resolve) => {
    TaroAlipay['getAuthCode']({
      scopes: 'auth_user',
      success: async(authInfo) => {
        const authCode = authInfo.authCode;
        const data = {code: authCode, env: "alipay"}
        await dealWithMiniProgramLogin(data, updateUsername, updateToken)
        resolve()
      }
    })
  })
};

async function dealWithMiniProgramLogin(obj, updateUsername, updateToken){
  return await fetch(HTTP_URL.miniProgramLogin, obj, 'get')
    .then(async (response) => {
      const data = response.data;
      if(data.status === 'SUCCESS'){
        updateUsername(data.result.username)
        updateToken(data.result.token)
        await setStorage('tk', data.result.token, true)
        await setStorage('sid', data.result.sid, true)
        initWebsocket()
      }
    })
    .catch(err => networkErr(err))
}
