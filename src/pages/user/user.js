import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image , Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/user'
import nicknamePic from './assets/nickname.png'
import historyPic from './assets/history.png'
import feedbackPic from './assets/feedback.png'
import aboutPic from './assets/about.png'
import systemPic from './assets/system.png'
import { get as getGlobalData } from '../../global_data'
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

  gotoSystemSetup = () => {
    Taro.navigateTo({
      url: '/pages/systemSetup/systemSetup'
    })
  }

  gotoFeedbackPage = () => {
    Taro.navigateTo({
      url: '/pages/feedback/feedback'
    })
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
    let headPicAddress = setHeadPic ? (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') ? setHeadPic : (getGlobalData('config').domain + ":" + getGlobalData('config').port + "/" + setHeadPic) : "";
    return (
      <View className="myInfo-container">
          <View className="user-info">
            <View className="user-pic">
              {
                setHeadPic
              ? <Image className="user-info-head-pic" src={headPicAddress} />
              : <Text className="user-head-text">{avatarText.slice(0,1).toUpperCase()}</Text>
              }
            </View>
            <View className="user-name">
                <Text className="nickname">{setNickname}</Text>
                <Text className="username">账号: {username}</Text>
            </View>
          </View>
          <View className="user-menu">
            {
              process.env.TARO_ENV !== 'alipay' ? <View>
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
                  <View className="system menu-item" onClick={this.gotoSystemSetup} >
                      <Image className="menu-ico" src={systemPic}></Image>
                      <Text className="menu-text">系统设置</Text>
                      <Text className="menu-arrow">></Text>
                  </View>
                </View>
              </View> :
              <View className="alipay-empty">
                <Text className="empty-text">空空如也</Text>
              </View>
            }

          </View>
      </View>
    );
  }
}

export default User
