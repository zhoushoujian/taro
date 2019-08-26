import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/home'
import { updateToken, updateIsFromLoginPage, updateUsername } from "../../store/login"
import { updateSetNickname, updateSetHeadPic } from "../../store/user"
import { getStorage } from "../../utils/utils"
import { signed, autoLogin, retrieveOthers, retrieveLastLoginTime, signInApp } from "./logic"
import { onLoginByWeapp } from "../../utils/taro.login";
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
        if(!token){
          token = await getStorage('tk');
        }
        if (token && !isFromLoginPage) {
          updateToken(token);
          await autoLogin(token, updateUsername, updateSetNickname, updateSetHeadPic);
        }
        await retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons);  //retrieve others status
        await retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus);  //get last sign time
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
    const { isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime } = this.props;
    if(token) {
      await signInApp(isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime);
    } else {
      if(process.env.TARO_ENV === "weapp"){
        onLoginByWeapp(e)
      } else {
        Taro.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  }

  render () {
    const { hour, minute, middle, greeting } = this.state;
    const { username, alreadySignUpPersons, notSignUpPersons, lastSignUpTime, onlinePersons, signedFlag, isSignedUp} = this.props;
    return (
      <View className="sign-main">
        <View className="header">
					<Text className="greetings">{greeting}</Text>
					<Text className="user">{username}</Text>
				</View>
				<View className="body">
        	<View className="sign-area">
        		<View className={`sign ${signedFlag}`} onClick={this.signIn}>
					    <Text className="sign-text">{isSignedUp ? '已签到' : '签到'}</Text>
					    <View id="now-time"><span className="hour">{hour}</span><span className="middle">{middle}</span><span className="minute">{minute}</span></View>
					  </View>
        		<Text className="last-sign-time">上一次签到时间：<Text className="last-sign">{lastSignUpTime}</Text></Text>
					  <View className="online-persons">
					  	<Text className="text">当前</Text>
					  	<Text className="persons">{onlinePersons}</Text>
					  	<Text className="text">人在线</Text>
					  </View>
        	</View>
        	<View className="count-area">
        	  <View className="signed"><Text className="signed-text">已签到:</Text>
        	    	<ScrollView className="signed-persons" enableFlex={true}>{alreadySignUpPersons}</ScrollView>
        	  </View>
        	  <View className="not-signed"><Text className="not-signed-text">未签到:</Text>
        	    	<ScrollView className="not-signed-persons" enableFlex={true}>{notSignUpPersons}</ScrollView>
        	  </View>
        	</View>
        </View>
  		</View>
    )
  }
}
