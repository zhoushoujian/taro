import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../store/home'
import { updateToken, updateIsFromLoginPage, updateUsername } from "../../store/login"
import { updateSetNickname, updateSetHeadPic } from "../../store/user"
import { getStorage, fetch, initWebsocket } from "../../utils/utils"
import { signed, autoLogin, retrieveOthers, retrieveLastLoginTime, signInApp } from "./logic"
import { onLoginByWeapp, onLoginByAlipay, remindWeAppUser } from "../../utils/taro.login"
import { get as getGlobalData } from '../../global_data'
import { HTTP_URL } from "../../constants/api"

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
      greeting: "",
      alipayStyle: ""
		}
	}

  async componentDidMount() {
    try {
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
      this.showTime();
      this.intervalTimer = setInterval(() => {
        this.showTime()
      }, 1000);
      this.greetings()
      if(username && !isFromLoginPage){
        if(isSignedUp){
          return signed(updateSignUpStatus, updateSignedFlag);
        }
      } else {
        if(!token) token = await getStorage("tk", true);
        if (token && !isFromLoginPage) {
          updateToken(token);
          initWebsocket();  //有token才在这里调websocket，没有token在注册登录的时候调websocket
          await autoLogin(token, updateUsername, updateSetNickname, updateSetHeadPic);
        }
        if(process.env.TARO_ENV === 'weapp'){
          if(token){
           // 如果微信用户已授权，直接调用接口更新用户昵称和头像
            remindWeAppUser(updateSetNickname, updateSetHeadPic)
          } else {
            // 调用微信登录接口注册并登录账号
            await onLoginByWeapp(updateUsername, updateToken)
          }
        } else if(process.env.TARO_ENV === 'alipay'){
          this.setState({
            alipayStyle: "useVH"
          })
          if(!token) {
            //  支付宝要求必须触发按钮的事件才能获取用户信息，无论是否已授权
            await onLoginByAlipay(updateUsername, updateToken)
          }
        }
        // if(!token) token = await getStorage("tk", true);
        if(!token) token = this.props.token
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

  signIn = async () => {
    const { isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime, updateSignedFlag, setNickname } = this.props;
    if(token) {
      if(process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay'){
        const sid = await getStorage('sid', true)  //使用sid作为小程序已授权的标志
        if(!sid || sid.length !== 9){
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
    //微信获取用户信息
    const { updateSetNickname,  updateSetHeadPic } = this.props;
    const userInfo = e.target.userInfo;
    let { avatarUrl, nickName, gender } = userInfo;
    console.warn("userInfo", userInfo)
    if(gender === 1) {
      gender = "男"
    } else if(gender === 0) {
      gender = "女"
    } else {
      gender = "未知"
    }
    this.updateAndUploadInfo(updateSetNickname, updateSetHeadPic, avatarUrl, nickName, gender)
  }

  onGetAuthorize = () => {
     //支付宝获取用户信息
    const { setNickname, setHeadPic } = this.props;
    if(setNickname || setHeadPic) return
    my.getOpenUserInfo({
      fail: (res) => {
        getGlobalData('alert')("只有授权才能签到");
      },
      success: (res) => {
        const { updateSetNickname,  updateSetHeadPic } = this.props;
        let userInfo = JSON.parse(res.response).response
        let { avatar, nickName, gender } = userInfo;
        if(gender === "m") {
          gender = "男"
        } else if(gender === "w") {
          gender = "女"
        } else {
          gender = "未知"
        }
        this.updateAndUploadInfo(updateSetNickname, updateSetHeadPic, avatar, nickName, gender)
      }
    });
  }

  //上传用户昵称，头像和性别
  updateAndUploadInfo = (updateSetNickname, updateSetHeadPic, avatar, nickName, gender) => {
    const { username, token } = this.props;
    updateSetNickname(nickName);
    updateSetHeadPic(avatar);
    const data = {
      userInfo: {
        nickname : nickName,
        sex : gender,
        user_pic: avatar
      },
      username,
      token
    }
    return fetch(HTTP_URL.updateUserInfo, data, 'post')
      .then((response) => {
        console.log("response", response)
      })
  }

  onAuthError = (err) => {
    console.error("alipay auth err", err)
    getGlobalData('alert')("只有授权才能签到");
  }

  render () {
    const { hour, minute, middle, greeting, alipayStyle } = this.state;
    let { username, token, alreadySignUpPersons=[], notSignUpPersons=[], lastSignUpTime, onlinePersons, signedFlag, isSignedUp, setNickname} = this.props;
    alreadySignUpPersons = alreadySignUpPersons ? alreadySignUpPersons : []
    notSignUpPersons = notSignUpPersons ? notSignUpPersons : []
    return (
      <View className={`sign-main ${alipayStyle}`}>
        <View className="header">
					<Text className="greetings">{greeting}</Text>
					<Text className="user">{token ? setNickname ? setNickname : username : ""}</Text>
				</View>
				<View className="body">
        	<View className="sign-area">
            {/* 支付宝兼容微信按钮但微信不兼容支付宝按钮 */}
            { process.env.TARO_ENV === "weapp" ?
                <Button className={`sign ${signedFlag}`} onClick={this.signIn}
                    openType='getUserInfo' onGetUserInfo={this.toBegin}  //weapp
                >
                  <Text className="sign-text">{isSignedUp ? '已签到' : '签到'}</Text>
					        <View id="now-time"><Text className="hour">{hour}</Text><Text className="middle">{middle}</Text><Text className="minute">{minute}</Text></View>
					      </Button>
                :
                <Button className={`sign ${signedFlag}`} onClick={this.signIn}
                  open-type="getAuthorize" onGetAuthorize={this.onGetAuthorize} onError={this.onAuthError} scope='userInfo' //alipay
                >
                  <Text className="sign-text">{isSignedUp ? '已签到' : '签到'}</Text>
					        <View id="now-time"><Text className="hour">{hour}</Text><Text className="middle">{middle}</Text><Text className="minute">{minute}</Text></View>
					      </Button>
            }

        		<Text className="last-sign-time">上一次签到时间：<Text className="last-sign">{lastSignUpTime}</Text></Text>
					  <View className="online-persons">
					  	<Text className="text">当前</Text>
					  	<Text className="persons">{onlinePersons}</Text>
					  	<Text className="text">人在线</Text>
					  </View>
        	</View>
        	<View className="count-area">
        	  <View className="signed"><Text className="signed-text">已签到:</Text>
        	    	<ScrollView className="signed-persons" enableFlex={true} >{alreadySignUpPersons.map(item => <Text key={item.username} className={item.origin || "h5"}>{item.username + `, `}</Text>)}</ScrollView>
        	  </View>
        	  <View className="not-signed"><Text className="not-signed-text">未签到:</Text>
        	    	<ScrollView className="not-signed-persons" enableFlex={true}>{notSignUpPersons.map(item => <Text key={item.username} className={item.origin || "h5" }>{item.username + `, `}</Text>)}</ScrollView>
        	  </View>
        	</View>
        </View>
  		</View>
    )
  }
}
