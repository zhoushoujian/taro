import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import UpdateUserInfoComponent from "./updateUserInfoComponent"
import  * as actions  from "../../store/user"
import './index.scss'

@connect(state => {
  return {
    ...state.login,
    ...state.user
  }
}, { ...actions })
export default class Nickname extends Component {

  config = {
    navigationBarTitleText: '设置昵称'
  }

  goBack = () => {
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
    let { setNickname, username, token, updateSetNickname } = this.props;
    setNickname = setNickname || "最多10个字";
    return (
      <View>
        <NavBar centerText="设置昵称" backFun={this.goBack} ></NavBar>
        <UpdateUserInfoComponent
          placeholder={setNickname}
          infoLength={10}
          infoErrorTip="昵称不允许超过10个字"
          name="nickname"
          backToMainPage={this.goBack}
          username={username}
          token={token}
          updateUserInfoDispatch={updateSetNickname}
        />
      </View>
    );
  }
}
