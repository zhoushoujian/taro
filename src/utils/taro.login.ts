import Taro from '@tarojs/taro';
import { HTTP_URL } from '../constants/api';
import { get as getGlobalData } from '../global_data';
import { networkErr, request, setStorage } from './utils';
import { initWebsocket } from './websocket';

// 微信登录
export const onLoginByWeapp = (updateUsername, updateToken) => {
  return new Promise((resolve) => {
    Taro.login({
      async success(res) {
        if (res.code) {
          const data = { code: res.code, env: 'weapp' };
          //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
          await dealWithMiniProgramLogin(data, updateUsername, updateToken);
          resolve(0);
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  });
};

export const remindWeAppUser = (updateSetNickname, updateSetHeadPic) => {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success(res) {
            const userInfo = res.userInfo;
            const { avatarUrl, nickName } = userInfo;
            updateSetNickname(nickName);
            updateSetHeadPic(avatarUrl);
          },
          fail() {
            // getGlobalData('alert')("请手动点击签到登录");
          },
        });
      } else {
        if (!getGlobalData('$getState')().user.setNickname && !getGlobalData('$getState')().user.setHeadPic) {
          getGlobalData('alert')('请手动点击签到登录');
        }
      }
    },
    fail() {
      // getGlobalData('alert')("请手动点击签到登录");
    },
  });
};

async function dealWithMiniProgramLogin(obj, updateUsername, updateToken) {
  return request(HTTP_URL.miniProgramLogin, obj, 'get')
    .then(async (response) => {
      const data = response.data;
      if (data.status === 'SUCCESS') {
        updateUsername(data.result.username);
        updateToken(data.result.token);
        await setStorage('userId', data.result.username);
        await setStorage('tk', data.result.token, true);
        await setStorage('sid', data.result.sid, true);
        initWebsocket();
      }
    })
    .catch((err) => networkErr(err));
}
