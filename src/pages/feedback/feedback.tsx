import { Button, Textarea, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from '../../components/navBar';
import { HTTP_URL } from '../../constants/api';
import { formatDate, networkErr, request } from '../../utils/utils';
import './index.scss';

@connect((state) => state.login, {})
class Feedback extends Component<any, any> {
  config = {
    navigationBarTitleText: '反馈',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleChange = (event) => {
    console.log('event', event);
    this.setState({
      value: event.target.value,
    });
  };

  submitFeedback = () => {
    const arr = [] as any[];
    const feedbackContent = this.state.value;
    console.log('feedbackContent', feedbackContent);
    if (!feedbackContent) return;
    if (feedbackContent.length > 200) {
      return Taro.showToast({
        title: '不允许超过200个字',
        icon: 'none',
        duration: 2000,
      });
    }
    const time = formatDate('yyyy-MM-dd hh:mm:ss');
    arr.push(time);
    arr.push(feedbackContent);
    const { username } = this.props;
    const data = Object.assign({}, { username }, { feedbackContent: arr });
    request(HTTP_URL.feedback, data, 'post')
      .then(() => {
        Taro.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000,
        });
      })
      .catch((err) => {
        return networkErr(err);
      });
  };

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user',
    });
  };

  render() {
    return (
      <View className='feedback-container'>
        <NavBar centerText='反馈' backFun={this.goBack}></NavBar>
        <View className='feedback-content'>
          <Textarea
            className='feedback-textarea'
            value={this.state.value}
            onInput={this.handleChange}
            placeholder='请详细描述你遇到的问题或建议'
            showConfirmBar={true}
          />
          <View className='submit-feedback'>
            <Button className='button' type='default' size='default' onClick={this.submitFeedback}>
              提交
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Feedback;
