import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import NavBar from "../../components/navBar"
import './index.scss'

class RestPassword extends Component {

  componentDidMount() {
    $('.reset-password-btn .button').on("touchstart", function () {
      $(this).addClass("active");
    });
    $('.reset-password-btn .button').on("touchend", function () {
      $(this).removeClass("active");
    })
  }

  resetPasswordKeyDownEvent = (evt) => {
      var e = evt;
      if (e.keyCode === 13) {
          window.$('.reset-password-username1').blur();
          window.$('.reset-password-password1').blur();
          window.$('.reset-password-password2').blur();
          window.$('.reset-password-password3').blur();
          this.resetPassword()
      }
  }

  resetPassword = () => {
      // resetPasswordFunc(this);
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  render(){
    return(
      <View className="reset-password-area">
        <NavBar centerText="重置密码" backFun={this.goBack}></NavBar>
        <View className="input-content">
          <View className="content">
            <Input type="text" className="reset-password-username1 form" placeholder="请输入用户名"
             size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password1 form" placeholder="请输入旧密码"
              size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password2 form" placeholder="请输入新密码"
                size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input type="password" className="reset-password-password3 form" placeholder="请再次输入新密码"
              size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
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
