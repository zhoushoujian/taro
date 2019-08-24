import Taro from '@tarojs/taro'
import { HTTP_URL } from "../../constants/api"
import { initWebsocket, networkErr } from "../common/logic"

export const logoutApp = (updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic) => {
  window.localStorage.removeItem("tk");
  updateIsFromLoginPage(true);
  updateToken("");
  updateLastSignUpTime("");
  updateAlreadySignUpPersons("");
  updateNotSignUpPersons("");
  updateSignUpStatus(false);
  updateLogOutFlag(true);
  updateSetNickname("");
  updateSetHeadPic("");
  const original = window.localStorage.getItem("userId");
  const newOne = window.localStorage ?
    "ls" + String(Date.now() + (Math.random() * 10000).toFixed(0)) :
    "no_ls" + String(Date.now() + (Math.random() * 10000).toFixed(0))
  window.localStorage.removeItem("userId");
  window.localStorage.setItem("userId", newOne);
  clearInterval(window.checkSocketState)
  window.ws.close();
  const data = {
    original,
    newOne
  }
  axios.post(HTTP_URL.replaceSocketLink, data)
    .then(response => {
      if (response.data.result === "success") {
        initWebsocket()
      }
    })
    .catch(err => {
      networkErr(err)
    })
    .finally(() => {
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    })
}
