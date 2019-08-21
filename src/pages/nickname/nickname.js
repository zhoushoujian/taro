import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from "../../components/navBar"
import UpdateUserInfoComponent from "./updateUserInfoComponent"
import './index.scss'

export default class Nickname extends Component {

goBack = () => {
  Taro.navigateTo({
    url: '/pages/user/user'
  })
}

backToMainPage = () => {
  Taro.navigateTo({
    url: '/pages/user/user'
  })
}

gotoLoginPage = () => {
  Taro.navigateTo({
    url: '/pages/login/login'
  })
}

render() {
  let { setNickname } = this.props;
  setNickname = setNickname ? setNickname : "最多10个字";
  return (
    <View>
      <NavBar centerText="设置昵称" backFun={this.goBack} ></NavBar>
        <UpdateUserInfoComponent pageTitle="设置昵称" placeholder={setNickname} infoLength={10} infoErrorTip="昵称不允许超过10个字" name="nickname" backToMainPage={this.backToMainPage} gotoLoginPage={this.gotoLoginPage} />
    </View>
  );
}
}
