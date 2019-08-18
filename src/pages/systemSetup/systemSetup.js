import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import './index.scss'

class SystemSetup extends Component {

    logoutApp = async() => {
        // await logoutApp(this);
    }

	  resetPassword = () => {
      Taro.navigateTo({
        url: '/pages/systemSetup/resetPasswordSys'
      })
    }

    goBack = () => {
      Taro.navigateTo({
        url: '/pages/user/user'
      })
    }

    render() {
		  let { token } = this.props;
      return (
        <View className="system-container">
          <NavBar centerText="设置" backFun={this.goBack} ></NavBar>
          <View className="system-content">
            <View className="reset-password" onClick={this.userAgreement}>
                <Text >重置密码</Text>
            </View>
            <View className="logout" onClick={this.serviceList}>
                <Text >退出登录</Text>
            </View>
          </View>
        </View>
      );
    }
}

export default SystemSetup;
