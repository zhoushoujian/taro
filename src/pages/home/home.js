import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/home'
import { updateToken, updateIsFromLoginPage, updateUsername } from "../../store/login"
import { updateSetNickname, updateSetHeadPic } from "../../store/user"
import { getStorage } from "../../utils/utils"
import { signed, autoLogin, retrieveOthers, retrieveLastLoginTime, signInApp } from "./logic"
import { onLoginByWeapp } from "../../utils/taro.login"
import { remindWeAppUser, dealWithALiPay } from "../../utils/common"
import './home.scss'


@connect(state => {
  return {
    ...state.home,
    ...state.login,
    ...state.user,
  }
}, { ...actions, updateToken, updateIsFromLoginPage, updateUsername, updateSetNickname, updateSetHeadPic })
export default class Home extends Component {
  config = {
    navigationBarTitleText: '签到'
  }

  constructor(props) {
		super(props);
		this.state = {
      hour: "",
      minute: "",
      middle: ":",
      greeting: ""
		}
	}

  async componentDidMount() {
    try {
      this.showTime();
      this.intervalTimer = setInterval(() => {
        this.showTime()
      }, 1000);
      this.greetings()
      let {
        token,
        username,
        isFromLoginPage,
        isSignedUp,
        updateToken,
        updateIsFromLoginPage,
        updateUsername,
        updateSetNickname,
        updateSetHeadPic,
        updateAlreadySignUpPersons,
        updateNotSignUpPersons,
        updateLastSignUpTime,
        updateSignUpStatus,
        updateSignedFlag
      } = this.props;
      if(username && !isFromLoginPage){
        if(isSignedUp){
          return signed(updateSignUpStatus, updateSignedFlag);
        }
      } else {
        if (token && !isFromLoginPage) {
          updateToken(token);
          await autoLogin(token, updateUsername, updateSetNickname, updateSetHeadPic);
        }
        if(process.env.TARO_ENV === 'weapp'){
          remindWeAppUser(updateSetNickname, updateSetHeadPic)
          if(!token){
            token = await getStorage('tk');
            await onLoginByWeapp(updateUsername, updateToken)
          }
        } else if(process.env.TARO_ENV === 'alipay'){
          await dealWithALiPay(updateToken, updateUsername, updateSetNickname, updateSetHeadPic)
        }
        if(!token){
          token = await getStorage("tk", true);
        }
        await retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons);  //retrieve others status
        await retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus, updateSignedFlag);  //get last sign time
        updateIsFromLoginPage(false);
      }
    } catch (err){
      console.error("home componentDidMount", err)
    }
  }

  componentWillUnmount(){
    clearInterval(this.intervalTimer)
  }

  showTime = () => {
    let minute = new Date().getMinutes(),
      hour = new Date().getHours();
    if (minute < 10) minute = "0" + minute;
    if (hour < 10) hour = "0" + hour;
    this.setState({
      hour,
      minute
    })
    if (this.state.middle === ":") {
      this.setState({
        middle: " "
      })
    } else {
      this.setState({
        middle: ":"
      })
    }
  }

  greetings = () => {
    let hour = new Date().getHours();
    if (hour < 6) {
      this.setState({ greeting: "凌晨好！" })
    } else if (hour < 8) {
      this.setState({ greeting: "早上好！" })
    } else if (hour < 11) {
      this.setState({ greeting: "上午好！" })
    } else if (hour < 14) {
      this.setState({ greeting: "中午好！" })
    } else if (hour < 17) {
      this.setState({ greeting: "下午好！" })
    } else if (hour < 19) {
      this.setState({ greeting: "傍晚好！" })
    } else if (hour < 24) {
      this.setState({ greeting: "晚上好！" })
    }
  }

  signIn = async (e) => {
    const { isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime, updateSignedFlag, setNickname } = this.props;
    if(token) {
      if(process.env.TARO_ENV === 'weapp'){
        if(!setNickname){
          return
        }
      }
      await signInApp(isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime, updateSignedFlag);
    } else {
      if(process.env.TARO_ENV !== 'weapp' && process.env.TARO_ENV !== 'alipay'){
        Taro.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  }

  toBegin = (e) => {
    const { updateSetNickname,  updateSetHeadPic } = this.props;
    const userInfo = e.target.userInfo;
    const { avatarUrl, nickName, gender } = userInfo;
    updateSetNickname(nickName);
    updateSetHeadPic(avatarUrl);
  }

  render () {
    const { hour, minute, middle, greeting } = this.state;
    let { username, token, alreadySignUpPersons=[], notSignUpPersons=[], lastSignUpTime, onlinePersons, signedFlag, isSignedUp, setNickname} = this.props;
    alreadySignUpPersons = alreadySignUpPersons ? alreadySignUpPersons : []
    notSignUpPersons = notSignUpPersons ? notSignUpPersons : []
    return (
      <View className="sign-main">
        <View className="header">
					<Text className="greetings">{greeting}</Text>
					<Text className="user">{token ? setNickname ? setNickname : username : ""}</Text>
				</View>
				<View className="body">
        	<View className="sign-area">
        		<Button className={`sign ${signedFlag}`} onClick={this.signIn}  openType='getUserInfo' onGetUserInfo={this.toBegin}>
					    <Text className="sign-text">{isSignedUp ? '已签到' : '签到'}</Text>
					    <View id="now-time"><Text className="hour">{hour}</Text><Text className="middle">{middle}</Text><Text className="minute">{minute}</Text></View>
					  </Button>
        		<Text className="last-sign-time">上一次签到时间：<Text className="last-sign">{lastSignUpTime}</Text></Text>
					  <View className="online-persons">
					  	<Text className="text">当前</Text>
					  	<Text className="persons">{onlinePersons}</Text>
					  	<Text className="text">人在线</Text>
					  </View>
        	</View>
        	<View className="count-area">
        	  <View className="signed"><Text className="signed-text">已签到:</Text>
        	    	<ScrollView className="signed-persons" enableFlex={true} >{alreadySignUpPersons.map(item => <Text key={item.username} className={item.origin === 'weixin' ? "weapp" : "h5"}>{item.username + `, `}</Text>)}</ScrollView>
        	  </View>
        	  <View className="not-signed"><Text className="not-signed-text">未签到:</Text>
        	    	<ScrollView className="not-signed-persons" enableFlex={true}>{notSignUpPersons.map(item => <Text key={item.username} className={item.origin === 'weixin' ? "weapp" : "h5"}>{item.username + `, `}</Text>)}</ScrollView>
        	  </View>
        	</View>
        </View>
  		</View>
    )
  }
}
