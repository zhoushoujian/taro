import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Loading } from 'components'
import { connect } from '@tarojs/redux'
import * as actions from 'store/home'
import { getWindowHeight } from 'utils/style'
import './home.scss'

@connect(state => state.home, { ...actions })
class Home extends Component {
  config = {
    navigationBarTitleText: '觅星峰'
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentWillMount(){

  }

  componentDidMount() {
    // NOTE 暂时去掉不适配的内容
    // Taro.showToast({
    //   title: '注意，由于严选小程序首页界面、接口大幅变动，暂时去掉不相符的部分，后续再跟进改动',
    //   icon: 'none',
    //   duration: 6000
    // })
    this.showTime();

    let hour = new Date().getHours();
    if (hour < 6) {
      document.getElementsByClassName("greetings")[0].innerHTML = "凌晨好！&nbsp;";
    } else if (hour < 8) {
      document.getElementsByClassName("greetings")[0].innerHTML = "早上好！&nbsp;";
    } else if (hour < 11) {
      document.getElementsByClassName("greetings")[0].innerHTML = "上午好！&nbsp;";
    } else if (hour < 14) {
      document.getElementsByClassName("greetings")[0].innerHTML = "中午好！&nbsp;";
    } else if (hour < 17) {
      document.getElementsByClassName("greetings")[0].innerHTML = "下午好！&nbsp;";
    } else if (hour < 19) {
      document.getElementsByClassName("greetings")[0].innerHTML = "傍晚好！&nbsp;";
    } else if (hour < 24) {
      document.getElementsByClassName("greetings")[0].innerHTML = "晚上好！&nbsp;";
    }

    this.intervalTimer = setInterval(() => {
      this.showTime()
    }, 1000);
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

  signIn = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  render () {
    // if (!this.state.loaded) {
    //   return <Loading />
    // }

    const { currentLocation, username, token, alreadySignUpPersons, notSignUpPersons, lastSignUpTime, onlinePersons} = this.props;
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
						  {/* {currentLocation ? <div id="position-location" style={{"marginTop":"20px"}}>您当前的位置: {typeof(currentLocation) === 'object' ? currentLocation.formatted_address : currentLocation}</div> : ""} */}
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

export default Home
