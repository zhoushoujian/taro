import Taro from '@tarojs/taro'
import { HTTP_URL } from "../../constants/api"
import { networkErr, initWebsocket } from "../common/logic"
import { logoutApp } from "../systemSetup/logic"

export const resetPasswordFunc = (token, value, updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic) => {
    let data = {};
    if(!token){
      let usernameValue = $('.reset-password-username1').val(),
          oldPasswordValue = $('.reset-password-password1').val(),
          newPasswordValue1 = $('.reset-password-password2').val(),
          newPasswordValue2 = $('.reset-password-password3').val();
      if (!usernameValue || !oldPasswordValue || !newPasswordValue1 || !newPasswordValue2) {
          alert('请填写所有信息');
          return;
      } else if(newPasswordValue1 !== newPasswordValue2){
          alert('两次密码输入不一致');
          return;
      } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(newPasswordValue1)) { //密码至少包含一个数字和一个字母
          alert("密码至少包含大小写字母和数字中的两种");
          return;
      }
      data = Object.assign({}, {
          username: usernameValue,
          oldPwd: oldPasswordValue,
          newPwd: newPasswordValue1
      });
    } else {
        const newPwd = value;
        if(!newPwd) {
            return;
        } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(newPwd)) { //密码至少包含一个数字和一个字母
            alert("密码至少包含大小写字母和数字中的两种");
            return;
        } else {
            data = Object.assign({}, {newPwd, token});
        }
    }
    console.log("HTTP_URL.resetPassword", HTTP_URL.resetPassword)
    axios.post(HTTP_URL.resetPassword, data)
      .then((response) => {
          console.info(`reset password response`, response.data);
          if (response.data.result === "lack_field") {
              alert('缺少字段');
              return;
          } else if(response.data.result === "username_not_exist") {
              alert('用户名不存在');
          } else if(response.data.result === "wrong_password") {
              alert('原密码错误');
          } else if(response.data.result === "reset_fail") {
              alert('重置失败');
          } else if(response.data.result === "token_expired") {
              alert('身份已过期，请重新登录');
          } else if(response.data.result.result === "reset_success"){
              alert('重置成功');
              setTimeout(() => {
                logoutApp(updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic);
              }, 300)
          } else {
              alert(response.data);
              console.error("resetPasswordFunc response.data", response.data)
          }
      })
      .catch(err => {
          networkErr(err);
      })
}

export const registerUsername = (updateUsername, updatePassword) => {
  let usernameValue = document.getElementsByName("register-username")[0].value;
  let pwdValue = document.getElementsByName("register-password")[0].value;
  let pwdValueAgain = document.getElementsByName("register-password-again")[0].value;
  if (!usernameValue) {
      alert("用户名不能为空");
      return;
  } else if (!pwdValue) {
      alert("密码不能为空");
      return;
  } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(pwdValue)) { //密码至少包含一个数字和一个字母
      alert("密码至少包含大小写字母和数字中的两种");
      return;
  } else if (pwdValue !== pwdValueAgain) {
      alert("两次输入的密码不一致，请重新输入");
      return;
  }
  let data = Object.assign({}, {
      username: usernameValue
  }, {
      pwd: pwdValue
  });
  axios.post(HTTP_URL.registerVerify , (data))
      .then((response) => {
          window.logger.info(`register  response`, response.data);
          if (response.data.result === "illegal_username") {
              alert("用户名不得超过32个字符");
              return;
          } else if (response.data.result === "username_exist") {
              alert('用户名已存在');
              return;
          } else if (response.data.result === "register_success"){
              alert('注册成功', '确定', () => {
                  document.getElementsByName("register-username")[0].value = "";
                  document.getElementsByName("register-password")[0].value = "";
                  document.getElementsByName("register-password-again")[0].value = "";
                  updateUsername(usernameValue);
                  updatePassword(pwdValue);
                  Taro.navigateTo({
                    url: '/pages/login/login'
                  })
              });
          } else if(response.data.result === "register_fail"){
              alert('注册失败');
          }
      })
      .catch(err => {
          networkErr(err);
      })
}

export const loginApp = (updateUsername, updatePassword, updateToken, updateSetNickname, updateSetHeadPic, updateIsFromLoginPage, updateLogOutFlag, updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons, username, password) => {
  let loginFlag;
  if(loginFlag) return;
  loginFlag = true;
  updateUsername(username);
  updatePassword(password);
  let data = Object.assign({}, { username }, { pwd: password })
  if (!username) {
      alert("用户名不能为空");
      return;
  } else if (!password) {
      alert("密码不能为空");
      return;
  }
  document.getElementById('loginButton').innerText = "登录中...";
  axios.post(HTTP_URL.loginVerify ,(data))
    .then(async (response) => {
      loginFlag = false;
      document.getElementById('loginButton').innerText = "登录";
      window.logger.info(`username login  response`, response.data);
      if (response.data.result === "error_username" || response.data.result === "error_password") {
        alert("用户名或密码错误");
        return;
      } else if (response.data.result === "empty_username") {
        alert("用户名不能为空");
        return;
      } else if(response.data.result.token){
        let result = response.data.result;
        let userProfile = result.userProfile || {};
        updateToken(result.token);
        updateSetNickname(userProfile.nickname);
        updateSetHeadPic(userProfile.user_pic);
        updateIsFromLoginPage(true);
        updateLogOutFlag(false);
        const original = window.localStorage.getItem("userId");
        const newOne = result.username
        clearInterval(window.checkSocketState)
        window.ws.close()
        window.localStorage.setItem("userId", newOne);
        const data = {
          original,
          newOne
        }
        return axios.post(HTTP_URL.replaceSocketLink, data)
          .then(async res => {
            if (res.data.result === "success"){
              initWebsocket()
              window.localStorage.setItem("tk", result.token);
            }
          })
          .catch(err => {
              console.error(`login  catch`, err);
              document.getElementById('loginButton').innerText = "登录"
              networkErr(err);
          })
          .finally(() => {
            Taro.navigateTo({
              url: '/pages/home/home'
            })
          })
      }
    })
    .catch(err => {
      console.error(`login  catch`, err);
      document.getElementById('loginButton').innerText = "登录"
      networkErr(err);
  })
}

