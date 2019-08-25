import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/login'
import NavBar from "../../components/navBar"
import { registerUsername } from "./logic"
import './index.scss'

@connect(state => state.login, { ...actions })
class Register extends Component {

  config = {
    navigationBarTitleText: '注册新用户'
  }

  constructor(props){
    super(props)
    this.state = {
      username: "",
      password1: "",
      password2: ""
    }
  }

  componentDidMount() {
    // $('.register-btn .button').on("touchstart", function () {
    //   $(this).addClass("active");
    // });
    // $('.register-btn .button').on("touchend", function () {
    //   $(this).removeClass("active");
    // })
  }

  registerKeyDownEvent = (evt) => {
      var e = evt;
      if (e.keyCode === 13) {
          // window.$('#register-username').blur();
          // window.$('#register-password1').blur();
          // window.$('#register-password2').blur();
          this.register();
      }
  }

  register = () => {
    const { username, password1, password2 } = this.state;
    registerUsername(this.props.updateUsername, this.props.updatePassword, username, password1, password2);
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

  typePassword1 = (e) => {
    this.setState({
      password1: e.target.value
    })
  }

  typePassword2 = (e) => {
    this.setState({
      password2: e.target.value
    })
  }

  render() {
    const { username, password1, password2 } = this.state;
    return (
      <View className="register-area">
        <NavBar centerText="注册新用户" backFun={this.goBack}></NavBar>
        <View className="input-content">
          <View className="content">
            <Input type="text" id="register-username" name="register-username" placeholder="请输入用户名"
              className="form" size="26" onKeyDown={(event) => this.registerKeyDownEvent(event)}
              value={username} onChange={this.typeUsername}
            />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input name="register-password" id="register-password1" type="password" placeholder="请输入密码，至少包含一个数字和字母"
              className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)}
              value={password1} onChange={this.typePassword1}
            />
          </View>
        </View>
        <View className="input-content">
          <View className="content">
            <Input name="register-password-again" id="register-password2" type="password" placeholder="请再次输入密码，至少包含一个数字和字母"
            className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)}
            value={password2} onChange={this.typePassword2}
          />
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
