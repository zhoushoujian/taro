import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";
import { networkErr } from "../common/logic"
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/textarea.scss";
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
    if(feedbackContent.length > 200) return alert("不允许超过200个字");
    arr.push(new Date().format("yyyy-MM-dd hh:mm:ss"));
    arr.push(feedbackContent);
    const { username } = this.props;
    const data = Object.assign({}, { username }, { feedbackContent: arr })
    window.axios.post(HTTP_URL.feedback, data)
      .then(() => {
        alert('提交成功')
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
            <AtTextarea
              className="feedback-textarea"
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              maxLength={200}
              placeholder="请详细描述你遇到的问题或建议"
              showConfirmBar
            />
            <View className="submit-feedback">
              <AtButton className="button" type='primary' size="small" full onClick={this.submitFeedback} >提交</AtButton>
            </View>
          </View>
      </View>
    );
  }
}

export default Feedback;
