import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from '../../components/navBar';
import * as action1 from '../../store/home';
import * as action2 from '../../store/login';
import * as action3 from '../../store/user';
import './index.scss';

@connect((state) => state.login, { ...action1, ...action2, ...action3 })
class SystemSetup extends Component<{ token: string }> {
  config = {
    navigationBarTitleText: '设置',
  };

  resetPassword = () => {
    if (this.props.token) {
      Taro.navigateTo({
        url: '/pages/systemSetup/resetPasswordSys',
      });
    }
  };

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/user',
    });
  };

  render() {
    return (
      <View className='system-container'>
        <NavBar centerText='设置' backFun={this.goBack}></NavBar>
        <View className='system-content'>
          <View className='reset-password' onClick={this.resetPassword}>
            <Text>重置密码</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default SystemSetup;
