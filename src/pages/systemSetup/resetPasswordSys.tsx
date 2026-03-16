import { Button, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from '../../components/navBar';
import * as action1 from '../../store/home';
import * as action2 from '../../store/login';
import * as action3 from '../../store/user';
import { resetPasswordFunc } from './logic';
import './index2.scss';

@connect((state) => state.login, { ...action1, ...action2, ...action3 })
class resetPasswordSys extends Component<any, any> {
  config = {
    navigationBarTitleText: '重置密码',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/systemSetup/systemSetup',
    });
  };

  resetPasswordKeyDownEvent = (evt) => {
    const e = evt;
    if (e.keyCode === 13) {
      //@ts-ignore
      document.querySelector('.reset-password-password3')?.blur();
      this.resetPassword();
    }
  };

  resetPassword = () => {
    resetPasswordFunc(this.props.token, this.state.value)?.then((valid) => {
      setTimeout(() => {
        valid && Taro.navigateBack();
      }, 500);
    });
  };

  type = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    return (
      <View className='reset-password-area'>
        <NavBar centerText='重置密码' backFun={this.goBack}></NavBar>
        <View className='input-content'>
          <View className='content'>
            <Input
              password={true}
              className='reset-password-password3 form'
              placeholder='请输入新密码'
              value={this.state.value}
              onInput={this.type}
            />
          </View>
        </View>
        <View className='reset-password-btn'>
          <Button type='primary' className='button' onClick={this.resetPassword}>
            提交
          </Button>
        </View>
        <View className='line-out'>
          <View className='line'></View>
        </View>
        <View className='tips-container'>
          <Text className='tips'>密码至少包含大小写字母和数字中的两种</Text>
        </View>
      </View>
    );
  }
}

export default resetPasswordSys;
