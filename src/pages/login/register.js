import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import NavBar from "../../components/navBar"
import './index.scss'

class Register extends Component {

  componentDidMount() {
    $('.register-btn .button').on("touchstart", function () {
      $(this).addClass("active");
    });
    $('.register-btn .button').on("touchend", function () {
      $(this).removeClass("active");
    })
  }

  registerKeyDownEvent = (evt) => {
      var e = evt;
      if (e.keyCode === 13) {
          window.$('#register-username').blur();
          window.$('#register-password1').blur();
          window.$('#register-password2').blur();
          this.register();
      }
  }

  register = () => {
      // registerUsername(this);
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  render() {
      return (
        <View className="register-area">
          <NavBar centerText="注册新用户" backFun={this.goBack}></NavBar>
          <View className="input-content">
            <View className="content">
              <Input type="text" id="register-username" name="register-username" placeholder="请输入用户名" className="form" size="26" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
            </View>
          </View>
          <View className="input-content">
            <View className="content">
              <Input name="register-password" id="register-password1" type="password" placeholder="请输入密码，至少包含一个数字和字母" className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
            </View>
          </View>
          <View className="input-content">
            <View className="content">
              <Input name="register-password-again" id="register-password2" type="password" placeholder="请再次输入密码，至少包含一个数字和字母" className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
            </View>
          </View>
          <View className="register-btn">
            <Text type="primary" className="button" onClick={this.register}>提交</Text>
          </View>
        </View>
      )
  }
}

export default Register
