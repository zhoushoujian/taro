import Taro from '@tarojs/taro'
import { HTTP_URL } from "../../constants/api"
import { networkErr, initWebsocket, fetch } from "../../utils/utils"
import { getStorage, removeStorage, setStorage } from "../../utils/utils"

export const logoutApp = async (updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic) => {
  await removeStorage("tk");
  updateIsFromLoginPage(true);
  updateToken("");
  updateLastSignUpTime("");
  updateAlreadySignUpPersons("");
  updateNotSignUpPersons("");
  updateSignUpStatus(false);
  updateLogOutFlag(true);
  updateSetNickname("");
  updateSetHeadPic("");
  // const original = await getStorage("userId");
  // const newOne = "ls" + String(Date.now() + (Math.random() * 10000).toFixed(0))
  // await removeStorage("userId");
  // await setStorage("userId", newOne);
  // clearInterval(window.checkSocketState)
  // window.ws.close();
  // const data = {
  //   original,
  //   newOne
  // }
  // fetch(HTTP_URL.replaceSocketLink, data, 'post')
  //   .then(response => {
  //     if (response.data.result === "success") {
  //       initWebsocket()
  //     }
  //   })
  //   .catch(err => {
  //     networkErr(err)
  //   })
  //   .finally(() => {
  //     Taro.navigateTo({
  //       url: '/pages/login/login'
  //     })
  //   })
}
