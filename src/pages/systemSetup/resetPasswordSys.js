import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import { resetPasswordFunc } from "./logic"
import * as action1 from "../../store/home"
import * as action2 from "../../store/login"
import * as action3 from "../../store/user"
import "./index.scss"

@connect(state => (state.login), { ...action1, ...action2, ...action3 })
class resetPasswordSys extends Component {

  config = {
    navigationBarTitleText: '重置密码'
  }

  constructor(props){
    super(props)
    this.state={
      value: ""
    }
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/systemSetup/systemSetup'
    })
  }

  resetPasswordKeyDownEvent = (evt) => {
    var e = evt;
    if (e.keyCode === 13) {
      document.querySelector('.reset-password-password3').blur();
      this.resetPassword()
    }
  }

  resetPassword = () => {
    let { updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic } = this.props;
    resetPasswordFunc(this.props.token, this.state.value, updateIsFromLoginPage, updateToken, updateLastSignUpTime, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLogOutFlag, updateSetNickname, updateSetHeadPic);
  }

  type = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  render(){
    return(
      <View className="reset-password-area">
        <NavBar centerText="重置密码" backFun={this.goBack} ></NavBar>
          <View className="input-content">
            <View className="content">
              <Input type="password" className="reset-password-password3 form" placeholder="请输入新密码" value={this.state.value}
                size="26" onKeyDown={this.resetPasswordKeyDownEvent} onChange={this.type} />
            </View>
          </View>
          <View className="reset-password-btn">
            <Button type="primary" className="button" value="提交" onClick={this.resetPassword}>提交</Button>
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

export default resetPasswordSys;
