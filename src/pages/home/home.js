import Taro, { Component, getLogManager } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/home'
import { greetings, signed, autoLogin, retrieveOthers, retrieveLastLoginTime, signInApp } from "./logic"
import { updateToken, updateIsFromLoginPage, updateUsername } from "../../store/login"
import { updateSetNickname, updateSetHeadPic } from "../../store/user"
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
			websocketOnlinePersons: []
		}
	}

  async componentDidMount() {
    try {
      this.showTime();
      this.intervalTimer = setInterval(() => {
        this.showTime()
      }, 1000);
      greetings()
      let { token, username, isFromLoginPage, isSignedUp, updateToken, updateIsFromLoginPage, updateUsername, updateSetNickname, updateSetHeadPic, updateAlreadySignUpPersons, updateNotSignUpPersons, updateLastSignUpTime, updateSignUpStatus } = this.props;
      if(username && !isFromLoginPage){
        if(isSignedUp){
          return signed(updateSignUpStatus);
        }
      } else {
        if(!token){
          token = window.localStorage.getItem('tk');
        }
        if (token) {
          updateToken(token);
          await autoLogin(token, updateUsername, updateSetNickname, updateSetHeadPic);
        }
        await retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons);  //retrieve others status
        await retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus);  //get last sign time
        updateIsFromLoginPage(false);
      }
    } catch (err){
      logger.error("home componentDidMount", err.stack || err.toString())
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
    $('#now-time .hour').html(hour);
    $('#now-time .minute').html(minute);
    if ($('#now-time .middle').html() === ":") {
      $('#now-time .middle').html("&nbsp;")
    } else {
      $('#now-time .middle').html(":")
    }
  }

  signIn = async () => {
    const { isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime } = this.props;
    if(token) {
      await signInApp(isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime);
    } else {
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
  }

  render () {
    const { username, alreadySignUpPersons, notSignUpPersons, lastSignUpTime, onlinePersons} = this.props;
    return (
      <View className="sign-main">
        <View className="header">
					<Text className="greetings"></Text>
					<Text className="user">{username}</Text>
				</View>
				<View className="body">
        	<View className="sign-area">
        		<View className="sign" onClick={this.signIn}>
					    <Text className="sign-text">签到</Text>
					    <View id="now-time"><span className="hour"></span><span className="middle">:</span><span className="minute"></span></View>
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
        	    	<ScrollView className="signed-persons">{alreadySignUpPersons}</ScrollView>
        	  </View>
        	  <View className="not-signed"><Text className="not-signed-text">未签到:</Text>
        	    	<ScrollView className="not-signed-persons">{notSignUpPersons}</ScrollView>
        	  </View>
        	</View>
        </View>
  		</View>
    )
  }
}
