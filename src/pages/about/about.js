import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import './index.scss'

class About extends Component {

  config = {
    navigationBarTitleText: '关于'
  }

  userAgreement = () => {
    Taro.navigateTo({
      url: '/pages/about/userAgreement'
    })
  }

  privacy = () => {
    Taro.navigateTo({
      url: '/pages/about/privacy'
    })
  }

  serviceList = () => {
    Taro.navigateTo({
      url: '/pages/about/serviceList'
    })
  }

  openSource = () => {
    Taro.navigateTo({
      url: '/pages/about/licence'
    })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user'
    })
  }

  render() {
    return (
      <View className="about-container">
        <NavBar centerText="关于" backFun={this.goBack} ></NavBar>
        <View className="about-content">
          <View className="user-agreement" onClick={this.userAgreement}>
              <Text >用户协议</Text>
          </View>
          <View className="service-list" onClick={this.serviceList}>
              <Text >服务条款</Text>
          </View>
          <View className="privacy" onClick={this.privacy}>
              <Text >隐私条款</Text>
          </View>
          <View className="open-source" onClick={this.openSource}>
              <Text >开源声明</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default About;
