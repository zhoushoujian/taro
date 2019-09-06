import Taro, { Component } from '@tarojs/taro'
import { View, Button, Textarea } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";
import { networkErr, fetch } from "../../utils/utils"
import './index.scss'

@connect(state => state.login, {  })
class Feedback extends Component {

  config = {
    navigationBarTitleText: '反馈'
  }

  constructor () {
    super(...arguments)
    this.state = {
      value: ''
    }
  }

  handleChange (event) {
    this.setState({
      value: event.target.value
    })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user'
    })
  }

  submitFeedback = () => {
    const arr = [];
    const feedbackContent = this.state.value;
    if(!feedbackContent) return;
    if(feedbackContent.length > 200){
      return Taro.showToast({
        title: "不允许超过200个字",
        icon: 'none',
        duration: 2000
      })
    }
    arr.push(new Date().format("yyyy-MM-dd hh:mm:ss"));
    arr.push(feedbackContent);
    const { username } = this.props;
    const data = Object.assign({}, { username }, { feedbackContent: arr })
    fetch(HTTP_URL.feedback, data, 'post')
      .then(() => {
        Taro.showToast({
          title: "提交成功",
          icon: 'none',
          duration: 2000
        })
      })
      .catch(err => {
        return networkErr(err);
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
            <Textarea
              className="feedback-textarea"
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              maxLength={200}
              placeholder="请详细描述你遇到的问题或建议"
              showConfirmBar
            />
            <View className="submit-feedback">
              <Button className="button" type='default' size="default" full onClick={this.submitFeedback} >提交</Button>
            </View>
          </View>
      </View>
    );
  }
}

export default Feedback;

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
      .length)));
  return fmt;
}
