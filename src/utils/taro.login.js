import Taro, { Component } from '@tarojs/taro'
import { fetch } from "./utils"
import { HTTP_URL } from "../constants/api"
import { get as getGlobalData } from '../global_data'
import { setStorage, getStorage, networkErr, initWebsocket } from './utils'

// 微信登录
export const onLoginByWeapp = async (updateUsername, updateToken) => {
  Taro.login({
    success: function(res) {
      if (res.code) {
        const code = {code: res.code}
        //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
        console.log("code", code)
        return fetch(HTTP_URL.weiXinLogin, code, 'get')
          .then(async (response) => {
            const data = response.data;
            if(data.status === 'SUCCESS'){
              updateUsername(data.result.username)
              updateToken(data.result.token)
              setStorage('tk', data.result.token)
              // replace websocket connection id
              const original = await getStorage("userId", true);
              const newOne = data.result.username
              getGlobalData("socketTask").close()
              await setStorage('userId', data.result.username, true)
              const obj = {
                original,
                newOne
              }
              return fetch(HTTP_URL.replaceSocketLink, obj, 'post')
                .then(async res => {
                  if (res.data.result === "success"){
                    initWebsocket()
                  }
                })
                .catch(err => {
                    console.error(`login  catch`, err);
                    networkErr(err);
                })
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
