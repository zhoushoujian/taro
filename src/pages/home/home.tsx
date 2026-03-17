import { Button, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import { HTTP_URL } from '../../constants/api';
import * as actions from '../../store/home';
import { updateToken, updateUsername } from '../../store/login';
import { updateSetHeadPic, updateSetNickname } from '../../store/user';
import { onLoginByWeapp, remindWeAppUser } from '../../utils/taro.login';
import { getStorage, removeStorage, request } from '../../utils/utils';
import { initWebsocket } from '../../utils/websocket';
import { autoLogin, retrieveLastLoginTime, retrieveOthers, signInApp, signed } from './logic';
import './home.scss';

@connect(
  (state) => {
    return {
      ...state.home,
      ...state.login,
      ...state.user,
    };
  },
  {
    ...actions,
    updateToken,
    updateUsername,
    updateSetNickname,
    updateSetHeadPic,
  },
)
export default class Home extends Component<any, any> {
  intervalTimer: NodeJS.Timeout;

  constructor(props) {
    super(props);
    this.state = {
      hour: '',
      minute: '',
      middle: ':',
      greeting: '',
    };
  }

  async componentDidMount() {
    try {
      const {
        username,
        isSignedUp,
        updateToken,
        updateUsername,
        updateSetNickname,
        updateSetHeadPic,
        updateAlreadySignUpPersons,
        updateNotSignUpPersons,
        updateLastSignUpTime,
        updateSignUpStatus,
        updateSignedFlag,
      } = this.props;
      let { token } = this.props;
      this.showTime();
      this.intervalTimer = setInterval(() => {
        this.showTime();
      }, 1000);
      this.greetings();
      if (username) {
        // 从除登录页外来的页面将不再请求接口，直接更新签到状态
        if (isSignedUp) {
          return signed(updateSignUpStatus, updateSignedFlag);
        }
      } else {
        if (!token) token = await getStorage('tk', true);
        if (token) {
          updateToken(token);
          initWebsocket(); //有token才在这里调websocket，没有token在注册登录的时候调websocket
          await autoLogin(token, updateUsername, updateSetNickname, updateSetHeadPic);
          // 如果微信用户已授权，直接调用接口更新用户昵称和头像
          remindWeAppUser(updateSetNickname, updateSetHeadPic);
        } else {
          // 调用微信登录接口注册并登录账号
          await onLoginByWeapp(updateUsername, updateToken);
        }
        if (!token) token = this.props.token;
        await retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons); //retrieve others status
        await retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus, updateSignedFlag); //get last sign time
      }
    } catch (err) {
      await removeStorage('tk', true);
      console.error('home componentDidMount', err);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimer);
  }

  showTime = () => {
    let minute = new Date().getMinutes(),
      hour = new Date().getHours();
    //@ts-ignore
    if (minute < 10) minute = '0' + minute;
    //@ts-ignore
    if (hour < 10) hour = '0' + hour;
    this.setState({
      hour,
      minute,
    });
    if (this.state.middle === ':') {
      this.setState({
        middle: ' ',
      });
    } else {
      this.setState({
        middle: ':',
      });
    }
  };

  greetings = () => {
    const hour = new Date().getHours();
    if (hour < 6) {
      this.setState({ greeting: '凌晨好！' });
    } else if (hour < 8) {
      this.setState({ greeting: '早上好！' });
    } else if (hour < 11) {
      this.setState({ greeting: '上午好！' });
    } else if (hour < 14) {
      this.setState({ greeting: '中午好！' });
    } else if (hour < 17) {
      this.setState({ greeting: '下午好！' });
    } else if (hour < 19) {
      this.setState({ greeting: '傍晚好！' });
    } else if (hour < 24) {
      this.setState({ greeting: '晚上好！' });
    }
  };

  signIn = async () => {
    const {
      isSignedUp,
      token,
      updateToken,
      updateAlreadySignUpPersons,
      updateNotSignUpPersons,
      updateSignUpStatus,
      updateLastSignUpTime,
      updateSignedFlag,
    } = this.props;
    if (token) {
      const sid: any = await getStorage('sid', true); //使用sid作为小程序已授权的标志
      console.log('signIn sid', sid);
      if (!sid || sid.length !== 9) {
        return;
      }
      await signInApp(
        isSignedUp,
        token,
        updateToken,
        updateAlreadySignUpPersons,
        updateNotSignUpPersons,
        updateSignUpStatus,
        updateLastSignUpTime,
        updateSignedFlag,
      );
    }
  };

  toBegin = (e) => {
    //微信获取用户信息
    const { updateSetNickname, updateSetHeadPic, username, token } = this.props;
    const userInfo = e.target.userInfo;
    console.log('toBegin userInfo', userInfo);
    if (userInfo) {
      let { avatarUrl, nickName, gender } = userInfo;
      if (gender === 1) {
        gender = '男';
      } else if (gender === 0) {
        gender = '女';
      } else {
        gender = '未知';
      }
      updateSetNickname(nickName);
      updateSetHeadPic(avatarUrl);
      const data = {
        userInfo: {
          nickname: nickName,
          sex: gender,
          user_pic: avatarUrl,
        },
        username,
        token,
      };
      return request(HTTP_URL.updateUserInfo, data, 'post').then((response) => {
        console.log('response', response);
      });
    }
  };

  getOnlinePersons = () => {
    Taro.navigateTo({
      url: '/pages/showOnlinePersons/showOnlinePersons',
    });
  };

  render() {
    const { hour, minute, middle, greeting } = this.state;
    const {
      username,
      token,
      alreadySignUpPersons = [],
      notSignUpPersons = [],
      lastSignUpTime,
      onlinePersons,
      signedFlag,
      isSignedUp,
      setNickname,
    } = this.props;
    return (
      <View className='sign-main'>
        <View className='header'>
          <Text className='greetings'>{greeting}</Text>
          <Text className='user'>{token ? username || setNickname : ''}</Text>
        </View>
        <View className='body'>
          <View className='sign-area'>
            <Button
              className={`sign ${signedFlag}`}
              onClick={this.signIn}
              openType='getUserInfo'
              onGetUserInfo={this.toBegin} //weapp
            >
              <Text className='sign-text'>{isSignedUp ? '已签到' : '签到'}</Text>
              <View id='now-time'>
                <Text className='hour'>{hour}</Text>
                <Text className='middle'>{middle}</Text>
                <Text className='minute'>{minute}</Text>
              </View>
            </Button>
            <Text className='last-sign-time'>
              上一次签到时间：
              <Text className='last-sign'>{lastSignUpTime}</Text>
            </Text>
            <View className='online-persons' onClick={this.getOnlinePersons}>
              <Text className='text'>当前</Text>
              <Text className='persons'>{onlinePersons || 0}</Text>
              <Text className='text'>人在线</Text>
            </View>
          </View>
          <View className='count-area'>
            <View className='signed'>
              <Text className='signed-text'>已签到:</Text>
              <ScrollView className='signed-persons' enableFlex={true}>
                {alreadySignUpPersons.map((item, index) => (
                  <Text key={item.username} className={item.origin || 'h5'}>
                    {item.username + (index === alreadySignUpPersons.length - 1 ? '' : `, `)}
                  </Text>
                ))}
              </ScrollView>
            </View>
            <View className='not-signed'>
              <Text className='not-signed-text'>未签到:</Text>
              <ScrollView className='not-signed-persons' enableFlex={true}>
                {notSignUpPersons.map((item, index) => (
                  <Text key={item.username} className={item.origin || 'h5'}>
                    {item.username + (index === notSignUpPersons.length - 1 ? '' : `, `)}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
