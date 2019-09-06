import { get as getGlobalData } from '../global_data'
import { getStorage, setStorage, networkErr, initWebsocket, fetch } from "./utils"
import { HTTP_URL } from "../constants/api"


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
              nickName,
              gender
            } = userInfo;
            updateSetNickname(nickName);
            updateSetHeadPic(avatarUrl);
          },
          fail() {
            getGlobalData('alert')("请手动点击签到登录");
          }
        })
      } else {
        getGlobalData('alert')("请手动点击签到登录");
      }
    },
    fail() {
      getGlobalData('alert')("请手动点击签到登录");
    }
  })
}

export const dealWithALiPay = async(updateToken, updateUsername, updateSetNickname, updateSetHeadPic) => {
  let token = await getStorage("tk", true)
  if (!token) {
    const username = "ZFB" + parseInt(Math.random() * 1e9)
    const pwd = String(parseInt(Math.random() * 1e9))
    const data = {
      username,
      pwd
    }
    return fetch(HTTP_URL.registerVerify, data, 'post')
      .then(async (response) => {
        if (response.data.result === "register_success") {
          fetch(HTTP_URL.loginVerify, data, 'post')
            .then(async (response) => {
              if (response.data.result.token) {
                token = response.data.result.token;
                const info = {
                  userInfo: {
                    origin: "alipay"
                  },
                  username,
                  token
                }
                fetch(HTTP_URL.updateUserInfo, info, "post")
                await setStorage("tk", token, true)
                updateToken(token);
                updateUsername(username);
                //change for websocket
                const original = await getStorage("userId", true);
                getGlobalData("socketTask").close()
                await setStorage('userId', username, true)
                const obj = {
                  original,
                  newOne: username
                }
                return fetch(HTTP_URL.replaceSocketLink, obj, 'post')
                  .then(async res => {
                    if (res.data.result === "success") {
                      initWebsocket()
                    }
                  })
                  .catch(err => {
                    console.error(`login  catch`, err);
                    networkErr(err);
                  })
              }
            })
        }
      })
  } else {
    const data = { token }
    updateToken(token);
    return fetch(HTTP_URL.tokenLogin, data, 'post')
			.then((response) => {
        let result = response.data.result;
        if (result.token && result.username) {
					let userProfile = result.userProfile || {};
					updateUsername(result.username);
					updateSetNickname(userProfile.nickname);
					updateSetHeadPic(userProfile.user_pic);
				}
      })
  }
}
