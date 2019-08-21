import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { loginApp } from "./logic"
import * as actions from '../../store/login'
import './index.scss'

@connect(state => state.login, { ...actions })
class Login extends Component {

  constructor(props){
      super(props);
      this.state = {
        usernamePlaceholder: "请输入用户名",
		    passwordPlaceholder: "请输入密码",
		    username: "",
		    password: "",
		    showAsPassword: "password"
      }
  }

  componentDidMount() {
    $('.login-btn .button').on("touchstart", function () {
      $(this).addClass("active");
    });
    $('.login-btn .button').on("touchend", function () {
      $(this).removeClass("active");
    })
  }

  componentWillUnmount(){

  }

  login = () => {
    loginApp(this.props.updateUsername, this.props.updatePassword);
  }

  gotoRegister = () => {
    Taro.navigateTo({
      url: '/pages/login/register'
    })
  }

  gotoResetPwd = () => {
    Taro.navigateTo({
      url: '/pages/login/resetPwd'
    })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/home/home'
    })
  }

    render() {
        let { usernamePlaceholder, passwordPlaceholder, username, password, showAsPassword } = this.state;
        return (
          <View className="first-page">
            <View className="pic-blur"></View>
            <View className="top">
                <Text className="sign-text">签到</Text>
                <Text className="record-life">记录生活每一天</Text>
            </View>
            <View className="index">
              <Text className="head">欢迎登录觅星峰</Text>
              <View className="main">
                <View className="input-content">
                  <View className="content">
                    <Input type="text" id="login-username" name="username" placeholder={usernamePlaceholder} className="form" size="26" value={username}
							        onKeyDown={(event) => this.keyDownEvent(event)}
							        onChange={this.setUsername} autoComplete="off"/>
                    <Text className="login-center-input-text">用户名</Text>
                  </View>
                </View>
                <View className="input-content">
                  <View className="content">
                    <Input name="password" id="login-password" type={showAsPassword} placeholder={passwordPlaceholder} className="form" value={password}
                      onKeyDown={(event) => this.keyDownEvent(event)}
							        onChange={this.setPassword}/>
                    <Text className="login-center-input-text">密码</Text>
                  </View>
                </View>
                <View className="login-btn">
                  <Text type="primary" className="button" id="loginButton" value="登录" onClick={this.login}>登录</Text>
                </View>
              </View>
                <View className="foot">
                  <Text className="register-text" onClick={this.gotoRegister}>
                      注册用户名
                  </Text>
                  <Text className="reset-password" onClick={this.gotoResetPwd}>
                      重置密码
                  </Text>
                </View>
            </View>
            <View className="back-btn" >
              <Text className="go-back" onClick={this.goBack}>
                返回
              </Text>
            </View>
          </View>
        );
    }
}



export default Login;
