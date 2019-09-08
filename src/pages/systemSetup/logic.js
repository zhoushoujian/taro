import { HTTP_URL } from "../../constants/api"
import { networkErr, fetch } from "../../utils/utils"
import { get as getGlobalData } from "../../global_data"

export const resetPasswordFunc = (token, value) => {
  let data = {};
  if(!token){
    getGlobalData('alert')('非法请求！');
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
        } else {
            getGlobalData('alert')(response.data);
            console.error("resetPasswordFunc response.data", response.data)
        }
    })
    .catch(err => {
        networkErr(err);
    })
}
