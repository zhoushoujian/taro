import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { loginApp } from "./logic"
import * as actions from '../../store/login'
import { updateSetNickname, updateSetHeadPic } from "../../store/user";
import { updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons } from "../../store/home"
import Background from "./assets/background.jpg";
import './index.scss'

@connect(state => state.login, { ...actions, updateSetNickname, updateSetHeadPic, updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons })
class Login extends Component {

  constructor(props){
      super(props);
      this.state = {
        usernamePlaceholder: "请输入用户名",
		    passwordPlaceholder: "请输入密码",
		    username: this.props.username || 'coffee',
		    password: this.props.password || 'zsjkl320723'
      }
  }

  config = {
    navigationBarTitleText: '登录'
  }

  login = () => {
    const { username, password } = this.state;
    const { updateUsername, updatePassword, updateToken, updateSetNickname, updateSetHeadPic, updateIsFromLoginPage, updateLogOutFlag, updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons } = this.props;
    loginApp(updateUsername, updatePassword, updateToken, updateSetNickname, updateSetHeadPic, updateIsFromLoginPage, updateLogOutFlag, updateAlreadySignUpPersons, updateNotSignUpPersons, updateOnlinePersons, username, password);
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

  setUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  setPassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  keyDownEvent = (evt) => {
    var e = evt;
    if (e.keyCode === 13) {
        this.login();
    }
  }

  render() {
    const { usernamePlaceholder, passwordPlaceholder, username, password } = this.state;
    return (
      <View className="first-page">
        {process.env.TARO_ENV === 'weapp' ? <Image className="pic-blur" src={Background} /> : <div className="pic-blur" /> }
        <View className="top">
            <Text className="sign-text">签到</Text>
            <Text className="record-life">记录生活每一天</Text>
        </View>
        <View className="index">
          <Text className="head">欢迎登录觅星峰</Text>
          <View className="main">
            <View className="input-content">
              <View className="content">
                <Input type="text" id="login-username" name="username"
                  placeholder={usernamePlaceholder}
                  className="form" size="26" value={username}
	  			        onKeyDown={this.keyDownEvent}
	  			        onChange={this.setUsername} autoComplete="off"/>
                <Text className="login-center-input-text">用户名</Text>
              </View>
            </View>
            <View className="input-content">
              <View className="content">
                <Input name="password" id="login-password"
                  placeholder={passwordPlaceholder}
                  type="password"
                  className="form" value={password}
                  onKeyDown={this.keyDownEvent}
	  			        onChange={this.setPassword}/>
                <Text className="login-center-input-text">密码</Text>
              </View>
            </View>
            <View className="login-btn">
              <Text type="primary" className="button" id="loginButton" value="登录" onClick={this.login}>登录</Text>
            </View>
          </View>
        </View>
        {process.env.TARO_ENV !== 'weapp' && <View className="back-btn" >
          <Text className="go-back" onClick={this.goBack}>
            返回
          </Text>
        </View>}
      </View>
    );
  }
}

export default Login;
