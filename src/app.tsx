import Taro from '@tarojs/taro';
import { Component, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { set as setGlobalData } from './global_data';
import configStore from './store';

const store = configStore();

setGlobalData('$dispatch', store.dispatch);
setGlobalData('$getState', store.getState);
setGlobalData('alert', (title) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration: 2000,
  });
});

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    console.log('current environment: ', process.env.TARO_ENV);
  }

  componentDidShow() {}

  componentDidHide() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
