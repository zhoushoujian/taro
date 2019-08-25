import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { resetPasswordFunc } from "./logic"
import './index.scss'

class RestPassword extends Component {

  config = {
    navigationBarTitleText: '重置密码'
  }

  constructor(props){
    super(props)
    this.state = {
      username: "",
      oldPassword: "",
      newPassword1: "",
      newPassword2: ""
    }
  }

  componentDidMount() {
    // $('.reset-password-btn .button').on("touchstart", function () {
    //   $(this).addClass("active");
    // });
    // $('.reset-password-btn .button').on("touchend", function () {
    //   $(this).removeClass("active");
    // })
  }

  resetPasswordKeyDownEvent = (evt) => {
      var e = evt;
      if (e.keyCode === 13) {
          // window.$('.reset-password-username1').blur();
          // window.$('.reset-password-password1').blur();
          // window.$('.reset-password-password2').blur();
          // window.$('.reset-password-password3').blur();
          this.resetPassword()
      }
  }

  resetPassword = () => {
    console.log('1111')
    const { username, oldPassword, newPassword1, newPassword2 } = this.state;
    resetPasswordFunc("", "value", "updateIsFromLoginPage", "updateToken", "updateLastSignUpTime", "updateAlreadySignUpPersons", "updateNotSignUpPersons", "updateSignUpStatus", "updateLogOutFlag", 'updateSetNickname', 'updateSetHeadPic', username, oldPassword, newPassword1, newPassword2);
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  typeUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  typeOldPassword = (e) => {
    this.setState({
      oldPassword: e.target.value
    })
  }

  typeNewPassword1 = (e) => {
    this.setState({
      newPassword1: e.target.value
    })
  }

  typeNewPassword2 = (e) => {
    this.setState({
      newPassword2: e.target.value
    })
  }

  render(){
    const { username, oldPassword, newPassword1, newPassword2 } = this.state;
    return(
      <View className="reset-password-area">
        <NavBar centerText="重置密码" backFun={this.goBack}></NavBar>
        <View className="input-content">
          <View className="content">
            <Input type="text" className="reset-password-username1 form" placeholder="请输入用户名" value={username} onChange={this.typeUsername}
             size="26" onKeyDown={this.resetPasswordKeyDownEvent} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password1 form" placeholder="请输入旧密码" value={oldPassword} onChange={this.typeOldPassword}
              size="26" onKeyDown={this.resetPasswordKeyDownEvent} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password2 form" placeholder="请输入新密码" value={newPassword1} onChange={this.typeNewPassword1}
                size="26" onKeyDown={this.resetPasswordKeyDownEvent} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password3 form" placeholder="请再次输入新密码" value={newPassword2} onChange={this.typeNewPassword2}
              size="26" onKeyDown={this.resetPasswordKeyDownEvent} />
           </View>
        </View>
        <View className="reset-password-btn">
          <Text type="primary" className="button" value="提交" onClick={this.resetPassword}>提交</Text>
        </View>
        <View className="line-out">
          <View className="line"></View>
        </View>
        <View className="tips-container">
          <Text className="tips">密码至少包含大小写字母和数字中的两种</Text>
        </View>
      </View>
    )
  }
}

export default RestPassword
