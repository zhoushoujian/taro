import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import * as action1 from "../../store/home"
import * as action2 from "../../store/login"
import * as action3 from "../../store/user"
import './index.scss'

@connect(state => state.login, { ...action1, ...action2, ...action3 })
class SystemSetup extends Component {

  config = {
    navigationBarTitleText: '设置'
  }

	resetPassword = () => {
    if(this.props.token){
      Taro.navigateTo({
        url: '/pages/systemSetup/resetPasswordSys'
      })
    }
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user'
    })
  }

  render() {
	  const { token } = this.props;
    return (
      <View className="system-container">
        <NavBar centerText="设置" backFun={this.goBack} ></NavBar>
        <View className="system-content">
          <View className="reset-password" onClick={this.resetPassword}>
            <Text >重置密码</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default SystemSetup;
