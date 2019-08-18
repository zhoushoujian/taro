import Taro, { Component } from '@tarojs/taro'
import { View, Text, Textarea } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";
import './index.scss'


class Feedback extends Component {

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user'
    })
  }

  submitFeedback = () => {
    let arr = [];
    let feedbackContent = window.$(".feedback-textarea").val();
    if(feedbackContent.length > 1000) return alert("不允许超过1000个字");
    arr.push(new Date().format("yyyy-MM-dd hh:mm:ss"));
    arr.push(feedbackContent);
    let {username} = window.$getState().login;
    let data = Object.assign({}, { username }, { feedbackContent: arr })
    window.axios.post(HTTP_URL.feedback, data)
      .then(() => {
          // Toast.success('提交成功', CON.toastTime);
          Taro.navigateTo({
            url: '/pages/user/user'
          })
      })
      .catch(err => {
          // logger.error('saveNickname  err', err.stack || err.toString());
          // return networkErr(err);
      })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user'
    })
  }

  render() {
    return (
      <View className="feedback-container">
        <NavBar centerText="反馈" backFun={this.goBack} ></NavBar>
          <View className="feedback-content">
              <Textarea className="feedback-textarea" placeholder="请详细描述你遇到的问题或建议" />
              <View className="submit-feedback">
                  <Text className="button" value="提交" onClick={this.submitFeedback}>提交</Text>
              </View>
          </View>
      </View>
    );
  }
}

export default Feedback;
