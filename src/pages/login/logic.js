import Taro from '@tarojs/taro'
import { HTTP_URL } from "../../constants/api"
import { networkErr, initWebsocket, getStorage, setStorage, fetch } from "../../utils/utils"
import { logoutApp } from "../systemSetup/logic"
import { get as getGlobalData } from '../../global_data'

export const resetPasswordFunc = (token, value, updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic, username, oldPassword, newPassword1, newPassword2) => {
    let data = {};
    if(!token){
      if (!username || !oldPassword || !newPassword1 || !newPassword2) {
          getGlobalData('alert')('请填写所有信息');
          return;
      } else if(newPassword1 !== newPassword2){
          getGlobalData('alert')('两次密码输入不一致');
          return;
      } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(newPassword1)) { //密码至少包含一个数字和一个字母
          getGlobalData('alert')("密码至少包含大小写字母和数字中的两种");
          return;
      }
      data = Object.assign({}, {
          username: username,
          oldPwd: oldPassword,
          newPwd: newPassword1
      });
    } else {
        const newPwd = value;
        if(!newPwd) {
            return;
        } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(newPwd)) { //密码至少包含一个数字和一个字母
            getGlobalData('alert')("密码至少包含大小写字母和数字中的两种");
            return;
        } else {
            data = Object.assign({}, {newPwd, token});
        }
    }
    console.log("HTTP_URL.resetPassword", HTTP_URL.resetPassword)
    fetch(HTTP_URL.resetPassword, data, 'post')
      .then((response) => {
          console.info(`reset password response`, response.data);
          if (response.data.result === "lack_field") {
              getGlobalData('alert')('缺少字段');
              return;
          } else if(response.data.result === "username_not_exist") {
              getGlobalData('alert')('用户名不存在');
          } else if(response.data.result === "wrong_password") {
              getGlobalData('alert')('原密码错误');
          } else if(response.data.result === "reset_fail") {
              getGlobalData('alert')('重置失败');
          } else if(response.data.result === "token_expired") {
              getGlobalData('alert')('身份已过期，请重新登录');
          } else if(response.data.result.result === "reset_success"){
              getGlobalData('alert')('重置成功');
              setTimeout(() => {
                Taro.navigateTo({
                  url: '/pages/login/login'
                })
                if(token){
                  logoutApp(updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic);
                }
              }, 300)
          } else {
              getGlobalData('alert')(response.data);
              console.error("resetPasswordFunc response.data", response.data)
          }
      })
      .catch(err => {
          networkErr(err);
      })
}

export const registerUsername = (updateUsername, updatePassword, username, password1, password2) => {
  if (!username) {
      getGlobalData('alert')("用户名不能为空");
      return;
  } else if (!password1) {
      getGlobalData('alert')("密码不能为空");
      return;
  } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(password1)) { //密码至少包含一个数字和一个字母
      getGlobalData('alert')("密码至少包含大小写字母和数字中的两种");
      return;
  } else if (password1 !== password2) {
      getGlobalData('alert')("两次输入的密码不一致，请重新输入");
      return;
  }
  let data = Object.assign({}, { username }, {  pwd: password1 });
  fetch(HTTP_URL.registerVerify, data, 'post')
      .then((response) => {
        console.info(`register  response`, response.data);
        if (response.data.result === "illegal_username") {
            getGlobalData('alert')("用户名不得超过32个字符");
            return;
        } else if (response.data.result === "username_exist") {
            getGlobalData('alert')('用户名已存在');
            return;
        } else if (response.data.result === "register_success"){
          getGlobalData('alert')('注册成功')
          updateUsername(username);
          updatePassword(password1);
          Taro.navigateTo({
            url: '/pages/login/login'
          })
        } else if(response.data.result === "register_fail"){
            getGlobalData('alert')('注册失败');
        }
      })
      .catch(err => {
          networkErr(err);
      })
}

export const loginApp = async (updateUsername, updatePassword, updateToken, updateSetNickname, updateSetHeadPic, updateIsFromLoginPage, updateLogOutFlag, updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons, username, password) => {
  let loginFlag;
  if(loginFlag) return;
  loginFlag = true;
  updateUsername(username);
  updatePassword(password);
  let data = Object.assign({}, { username }, { pwd: password })
  if (!username) {
      getGlobalData('alert')("用户名不能为空");
      return;
  } else if (!password) {
      getGlobalData('alert')("密码不能为空");
      return;
  }
  fetch(HTTP_URL.loginVerify, data, 'post')
    .then(async (response) => {
      loginFlag = false;
      console.info(`username login  response`, response.data);
      if (response.data.result === "error_username" || response.data.result === "error_password") {
        getGlobalData('alert')("用户名或密码错误");
        return;
      } else if (response.data.result === "empty_username") {
        getGlobalData('alert')("用户名不能为空");
        return;
      } else if(response.data.result.token){
        let result = response.data.result;
        let userProfile = result.userProfile || {};
        updateToken(result.token);
        updateSetNickname(userProfile.nickname);
        updateSetHeadPic(userProfile.user_pic);
        updateIsFromLoginPage(true);
        updateLogOutFlag(false);
        // const original = await getStorage("userId");
        // const newOne = result.username
        // clearInterval(window.checkSocketState)
        // window.ws.close()
        // await setStorage("userId", newOne);
        // const data = {
        //   original,
        //   newOne
        // }
        // return axios.post(HTTP_URL.replaceSocketLink, data)
        //   .then(async res => {
        //     if (res.data.result === "success"){
        //       initWebsocket()
        //       await setStorage("tk", result.token);
        //     }
        //   })
        //   .catch(err => {
        //       console.error(`login  catch`, err);
        //       networkErr(err);
        //   })
        //   .finally(() => {
            Taro.navigateTo({
              url: '/pages/home/home'
            })
          // })
      }
    })
    .catch(err => {
      console.error(`login  catch`, err);
      networkErr(err);
  })
}

