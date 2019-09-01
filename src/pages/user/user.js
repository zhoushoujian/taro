import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'
import * as actions from '../../store/user'
import nicknamePic from './assets/nickname.png'
import historyPic from './assets/history.png'
import feedbackPic from './assets/feedback.png'
import aboutPic from './assets/about.png'
import systemPic from './assets/system.png'
import { get as getGlobalData } from '../../global_data'

import "taro-ui/dist/style/components/avatar.scss";
import './user.scss'


@connect(state => {
  return {
    ...state.user,
    ...state.login
  }
}, { ...actions })
class User extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  searchHistory = () => {
    Taro.navigateTo({
      url: '/pages/history/history'
    })
  }

  gotoAboutPage = () => {
    Taro.navigateTo({
      url: '/pages/about/about'
    })
  }

  gotoSystemSetup = () => {
    Taro.navigateTo({
      url: '/pages/systemSetup/systemSetup'
    })
  }

  setNickname = () => {
    Taro.navigateTo({
      url: '/pages/nickname/nickname'
    })
  }

  gotoFeedbackPage = () => {
    Taro.navigateTo({
      url: '/pages/feedback/feedback'
    })
  }

  gotoLoginPage = () => {
    if(process.env.TARO_ENV !== 'weapp'){
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
  }

  toBegin = (e) => {
    const { updateSetNickname,  updateSetHeadPic } = this.props;
    const userInfo = e.target.userInfo;
    const { avatarUrl, nickName, gender } = userInfo;
    updateSetNickname(nickName);
    updateSetHeadPic(avatarUrl);
  }

  render() {
    let { username, token, setNickname, setHeadPic } = this.props;
    let avatarText = setNickname || username
    setNickname = setNickname || "昵称未设置";
    if(!token) username = "";
    let headPicAddress = setHeadPic ? process.env.TARO_ENV === 'weapp' ? setHeadPic : (getGlobalData('config').domain + ":" + getGlobalData('config').port + "/" + setHeadPic) : "";
    return (
      <View className="myInfo-container">
          {token ? <View className="user-info">
            <View className="user-pic">
              {setHeadPic
              ? <Image className="user-info-head-pic" src={headPicAddress} />
              : <AtAvatar circle text={avatarText}></AtAvatar>}
            </View>
            <View className="user-name">
                <Text className="nickname">{setNickname}</Text>
                <Text className="username">账号: {username}</Text>
            </View>
          </View>
          : <Button className="not-login-user" onClick={this.gotoLoginPage} openType='getUserInfo' onGetUserInfo={this.toBegin} >
              <View className="not-login-circus">
                  <View className="not-login-inner-circus"></View>
                  <Text className="not-login-text">登录</Text>
              </View>
            </Button>}
          <View className="user-menu">
            {process.env.TARO_ENV !== 'weapp' && <View className="menu-block">
              <View className="set-nickname menu-item" onClick={this.setNickname}>
                <Image className="menu-ico" src={nicknamePic}></Image>
                <Text className="menu-text">设置昵称</Text>
                <Text className="menu-arrow">></Text>
              </View>
            </View>}
            <View className="interval"></View>
            <View className="menu-block">
              <View className="sign-history menu-item" onClick={this.searchHistory}>
                <Image className="menu-ico" src={historyPic}></Image>
                <Text className="menu-text">签到历史</Text>
                <Text className="menu-arrow">></Text>
              </View>
            </View>
            <View className="interval"></View>
            <View className="menu-block">
              <View className="feedback menu-item" onClick={this.gotoFeedbackPage}>
                <Image className="menu-ico" src={feedbackPic}></Image>
                <Text className="menu-text">反馈</Text>
                <Text className="menu-arrow">></Text>
              </View>
              {
                process.env.TARO_ENV !== 'weapp' && <View className="about menu-item" onClick={this.gotoAboutPage}>
                  <Image className="menu-ico" src={aboutPic}></Image>
                  <Text className="menu-text">关于</Text>
                  <Text className="menu-arrow">></Text>
                </View>
              }
              <View className="system menu-item" onClick={this.gotoSystemSetup} >
                  <Image className="menu-ico" src={systemPic}></Image>
                  <Text className="menu-text">系统设置</Text>
                  <Text className="menu-arrow">></Text>
              </View>
            </View>
          </View>
      </View>
    );
  }
}

export default User
