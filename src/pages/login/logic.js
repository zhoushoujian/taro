import { HTTP_URL } from "../../constants/api"

export const resetPasswordFunc = (token) => {
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
        let newPwd = $('.reset-password-password3').val();
        if(!newPwd) {
            return;
        } else if (!/^(?=(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d))[^]{6,16}$/.test(newPwd)) { //密码至少包含一个数字和一个字母
            alert("密码至少包含大小写字母和数字中的两种");
            return;
        } else {
            data = Object.assign({}, {newPwd, token});
        }
    }

    Toast.loading('Loading...', CON.toastLoadingTime, () => {});
    axios.post(HTTP_URL.resetPassword, data)
    .then((response) => {
        Toast.hide();
        window.logger.info(`reset password response`, response.data);
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
            logoutApp(self);
        } else {
            alert(response.data);
            logger.error("resetPasswordFunc response.data", response.data)
        }
    })
    .catch(err => {
        Toast.hide();
        // window.logger.error(`forget  err`, err);
        networkErr(err);
    })
}
