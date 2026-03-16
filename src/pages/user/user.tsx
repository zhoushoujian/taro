import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/user';
import feedbackPic from './assets/feedback.png';
import historyPic from './assets/history.png';
import systemPic from './assets/system.png';
import './user.scss';

@connect(
  (state) => {
    return {
      ...state.user,
      ...state.login,
    };
  },
  { ...actions },
)
class User extends Component<any> {
  config = {
    navigationBarTitleText: '个人中心',
  };

  searchHistory = () => {
    Taro.navigateTo({
      url: '/pages/history/history',
    });
  };

  gotoSystemSetup = () => {
    Taro.navigateTo({
      url: '/pages/systemSetup/systemSetup',
    });
  };

  gotoFeedbackPage = () => {
    Taro.navigateTo({
      url: '/pages/feedback/feedback',
    });
  };

  render() {
    let { username, token, setNickname, setHeadPic } = this.props;
    const avatarText = setNickname || username;
    setNickname = setNickname || '昵称未设置';
    if (!token) username = '';
    const headPicAddress = setHeadPic || '';
    return (
      <View className='myInfo-container'>
        <View className='user-info'>
          <View className='user-pic'>
            {setHeadPic ? (
              <Image className='user-info-head-pic' src={headPicAddress} />
            ) : (
              <Text className='user-head-text'>{avatarText.slice(0, 1).toUpperCase()}</Text>
            )}
          </View>
          <View className='user-name'>
            <Text className='nickname'>{setNickname}</Text>
            <Text className='username'>账号: {username}</Text>
          </View>
        </View>
        <View className='user-menu'>
          <View>
            <View className='interval'></View>
            <View className='menu-block'>
              <View className='sign-history menu-item' onClick={this.searchHistory}>
                <Image className='menu-ico' src={historyPic}></Image>
                <Text className='menu-text'>签到历史</Text>
                <Text className='menu-arrow'>&gt;</Text>
              </View>
            </View>
            <View className='interval'></View>
            <View className='menu-block'>
              <View className='feedback menu-item' onClick={this.gotoFeedbackPage}>
                <Image className='menu-ico' src={feedbackPic}></Image>
                <Text className='menu-text'>反馈</Text>
                <Text className='menu-arrow'>&gt;</Text>
              </View>
              <View className='system menu-item' onClick={this.gotoSystemSetup}>
                <Image className='menu-ico' src={systemPic}></Image>
                <Text className='menu-text'>系统设置</Text>
                <Text className='menu-arrow'>&gt;</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default User;
